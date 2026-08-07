#!/usr/bin/env node
/**
 * Confiabilidad de instrumentos: alfa de Cronbach y KR-20.
 *
 * Entrada: CSV donde cada FILA es un encuestado y cada COLUMNA un ítem.
 * Con encabezado o sin él (usa --sin-encabezado si la primera fila ya son datos).
 *
 * Uso:
 *   node confiabilidad.js piloto.csv                # alfa de Cronbach (Likert / escalas)
 *   node confiabilidad.js piloto.csv --kr20         # KR-20 (ítems dicotómicos 0/1)
 *   node confiabilidad.js piloto.csv --sin-encabezado
 *   node confiabilidad.js piloto.csv --dimensiones D1,D1,D2,D2   # alfa por dimensión (una etiqueta por columna, en orden)
 *   node confiabilidad.js piloto.csv --salida output/trabajo/calculo-alfa.md
 *
 * Imprime varianzas por ítem, el cálculo paso a paso, la correlación
 * ítem-total corregida de cada ítem (r < 0.30 → revisar/eliminar), el IC 95%
 * del coeficiente (bootstrap no paramétrico con semilla fija, reproducible),
 * y tres avisos de calidad: α > 0.95 (redundancia de ítems), α > 0.90
 * (revisar redundancia, Streiner 2003) y pares de ítems con r ≥ 0.90
 * (candidatos a duplicados). Sin dependencias externas.
 */
'use strict';
const { readCsv } = require('./lib-csv');
const { varianceSample, pearson } = require('./lib-stats');
const { imprimirYGuardar } = require('./lib-salida');

function parseArgs(argv) {
  const a = { kr20: false, sinEncabezado: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--kr20') a.kr20 = true;
    else if (arg === '--sin-encabezado') a.sinEncabezado = true;
    else if (arg === '--dimensiones') a.dimensiones = argv[++i].split(',').map((s) => s.trim());
    else if (arg === '--salida') a.salida = argv[++i];
    else a.csv = arg;
  }
  if (!a.csv) {
    console.error('Uso: node confiabilidad.js archivo.csv [--kr20] [--sin-encabezado] [--dimensiones D1,D1,D2,...]');
    process.exit(2);
  }
  return a;
}

function cargarDatos(ruta, conEncabezado) {
  let filas = readCsv(ruta);
  if (conEncabezado) filas = filas.slice(1);
  const datos = filas.map((f) => f.map(Number));
  const k = datos[0].length;
  if (datos.some((f) => f.length !== k)) {
    console.error('ERROR: todas las filas deben tener la misma cantidad de ítems.');
    process.exit(1);
  }
  if (datos.some((f) => f.some((v) => Number.isNaN(v)))) {
    console.error('ERROR: hay celdas no numéricas en el CSV.');
    process.exit(1);
  }
  return datos;
}

function columnas(datos) {
  const k = datos[0].length;
  const cols = [];
  for (let j = 0; j < k; j++) cols.push(datos.map((f) => f[j]));
  return cols;
}

function alfaCronbach(datos) {
  const k = datos[0].length;
  const items = columnas(datos);
  const varItems = items.map(varianceSample);
  const totales = datos.map((f) => f.reduce((a, b) => a + b, 0));
  const varTotal = varianceSample(totales);
  const sumVi = varItems.reduce((a, b) => a + b, 0);
  const alfa = (k / (k - 1)) * (1 - sumVi / varTotal);
  return { alfa, k, varItems, varTotal, sumVi };
}

function kr20(datos) {
  const k = datos[0].length;
  const n = datos.length;
  const items = columnas(datos);
  for (const col of items) {
    if (col.some((v) => v !== 0 && v !== 1)) {
      console.error('ERROR: KR-20 requiere ítems dicotómicos (solo 0 y 1). Para escalas usa alfa de Cronbach.');
      process.exit(1);
    }
  }
  const pq = items.map((col) => {
    const p = col.reduce((a, b) => a + b, 0) / n;
    return p * (1 - p);
  });
  const totales = datos.map((f) => f.reduce((a, b) => a + b, 0));
  const varTotal = varianceSample(totales);
  const sumPq = pq.reduce((a, b) => a + b, 0);
  const coef = (k / (k - 1)) * (1 - sumPq / varTotal);
  return { coef, k, pq, varTotal, sumPq };
}

// Correlación ítem-total corregida: para cada ítem, correlación de Pearson
// entre ese ítem y el total de los DEMÁS ítems (sin incluirse a sí mismo,
// para no inflar artificialmente la correlación de cada ítem con su propio
// aporte al total).
function correlacionItemTotal(datos) {
  const k = datos[0].length;
  const items = columnas(datos);
  return items.map((col, j) => {
    const totalSinItem = datos.map((f) => f.reduce((acc, v, i) => (i === j ? acc : acc + v), 0));
    return pearson(col, totalSinItem);
  });
}

// Pares de ítems con correlación ≥ umbral (candidatos a redundancia).
function paresCorrelacionAlta(datos, umbral) {
  const cols = columnas(datos);
  const pares = [];
  for (let i = 0; i < cols.length; i++) {
    for (let j = i + 1; j < cols.length; j++) {
      const r = pearson(cols[i], cols[j]);
      if (r >= umbral) pares.push({ i: i + 1, j: j + 1, r });
    }
  }
  return pares;
}

// ---------- Bootstrap no paramétrico para el IC 95% del coeficiente ----------
// Semilla fija derivada de los datos: mismo CSV → mismo intervalo (reproducible).

function hashSeed(texto) {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function intervaloConfiabilidad(datos, calc, nRemuestras) {
  const n = datos.length;
  const rnd = mulberry32(hashSeed(JSON.stringify(datos)));
  const vals = [];
  for (let b = 0; b < nRemuestras; b++) {
    const rem = [];
    for (let i = 0; i < n; i++) rem.push(datos[Math.floor(rnd() * n)]);
    vals.push(calc(rem));
  }
  vals.sort((x, y) => x - y);
  return {
    lo: vals[Math.floor(0.025 * nRemuestras)],
    hi: vals[Math.floor(0.975 * nRemuestras)],
  };
}

function interpretar(v) {
  if (v >= 0.9) return 'excelente';
  if (v >= 0.8) return 'buena';
  if (v >= 0.7) return 'aceptable';
  if (v >= 0.6) return 'cuestionable';
  return 'insuficiente — revisar/depurar ítems';
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  const datos = cargarDatos(a.csv, !a.sinEncabezado);
  const n = datos.length, k = datos[0].length;
  const lineas = [`Encuestados: ${n} | Ítems: ${k}`];

  if (a.dimensiones && a.dimensiones.length !== k) {
    console.error(`ERROR: --dimensiones trae ${a.dimensiones.length} etiquetas pero el CSV tiene ${k} columnas (una etiqueta por columna, en orden).`);
    process.exit(1);
  }

  let coef, nombre, calc;
  if (a.kr20) {
    const r = kr20(datos);
    lineas.push('Fórmula KR-20: (k/(k-1)) · (1 - Σp·q / Vt)');
    lineas.push(`  Σp·q = ${r.sumPq.toFixed(4)} | Vt = ${r.varTotal.toFixed(4)}`);
    coef = r.coef; nombre = 'KR-20';
    calc = (d) => kr20(d).coef;
  } else {
    const r = alfaCronbach(datos);
    lineas.push('Fórmula alfa de Cronbach: (k/(k-1)) · (1 - ΣVi / Vt)');
    lineas.push('  Varianza por ítem: ' + r.varItems.map((v) => v.toFixed(4)).join(', '));
    lineas.push(`  ΣVi = ${r.sumVi.toFixed(4)} | Vt (varianza de totales) = ${r.varTotal.toFixed(4)}`);
    coef = r.alfa; nombre = 'Alfa de Cronbach';
    calc = (d) => alfaCronbach(d).alfa;
  }

  lineas.push('');
  lineas.push(`${nombre} = ${coef.toFixed(3)}  → confiabilidad ${interpretar(coef)}`);

  if (n < 30) {
    lineas.push(`⚠ AVISO: n=${n} < 30 — con muestras pequeñas la estimación del coeficiente es inestable (IC 95% amplio). No invalida el resultado, pero debe declararse como limitación del piloto (ver discusion.md).`);
  }

  const ic = intervaloConfiabilidad(datos, calc, 2000);
  lineas.push(`IC 95% (bootstrap no paramétrico, 2000 remuestras, semilla fija): [${ic.lo.toFixed(3)}, ${ic.hi.toFixed(3)}]`);

  if (coef > 0.95) {
    lineas.push('⚠ ALERTA: el coeficiente supera 0.95 — casi siempre indica REDUNDANCIA de ítems (varios miden lo mismo). Revisar los pares con r ≥ 0.90 y, si procede, fusionar/eliminar ítems y repetir el piloto.');
  } else if (coef > 0.90) {
    lineas.push('⚠ AVISO: coeficiente > 0.90 — revisar redundancia de ítems (Streiner, 2003), aunque el valor sea válido.');
  }

  const itemTotal = correlacionItemTotal(datos);
  lineas.push('');
  lineas.push('Correlación ítem-total corregida (r de Pearson entre cada ítem y el total de los demás):');
  const debiles = [];
  itemTotal.forEach((r, i) => {
    const marca = r < 0.3 ? '  ← revisar/eliminar (r < 0.30)' : '';
    if (r < 0.3) debiles.push(i + 1);
    lineas.push(`  Ítem ${i + 1}: r = ${r.toFixed(3)}${marca}`);
  });
  if (debiles.length > 0) {
    lineas.push(`Ítems con correlación ítem-total débil (r < 0.30): ${debiles.join(', ')} — distorsionan la medición, revisar redacción o eliminar y repetir el piloto.`);
  }

  if (!a.kr20) {
    const duplicados = paresCorrelacionAlta(datos, 0.9);
    lineas.push('');
    if (duplicados.length > 0) {
      lineas.push('Pares de ítems casi duplicados (r ≥ 0.90) — candidatos a eliminar/fusionar por redundancia:');
      duplicados.forEach((p) => lineas.push(`  Ítems ${p.i} y ${p.j}: r = ${p.r.toFixed(3)}`));
    } else {
      lineas.push('Correlación inter-ítem: sin pares con r ≥ 0.90 — sin indicios de redundancia.');
    }
  }

  if (a.dimensiones) {
    const etiquetas = [...new Set(a.dimensiones)];
    lineas.push('');
    lineas.push(`Alfa por dimensión (etiquetas recibidas: ${a.dimensiones.join(', ')}):`);
    etiquetas.forEach((etq) => {
      const cols = a.dimensiones.map((e, i) => (e === etq ? i : -1)).filter((i) => i >= 0);
      if (cols.length < 2) {
        lineas.push(`  Dimensión "${etq}" (${cols.length} ítem): alfa no aplica — se necesitan al menos 2 ítems por dimensión para calcular Cronbach.`);
        return;
      }
      const sub = datos.map((f) => cols.map((c) => f[c]));
      const r = alfaCronbach(sub);
      const marca = r.alfa > 0.95 ? '  ← ALERTA redundancia' : r.alfa < 0.7 ? '  ← por debajo del umbral 0.70' : '';
      lineas.push(`  Dimensión "${etq}" (${cols.length} ítems): alfa = ${r.alfa.toFixed(3)} (confiabilidad ${interpretar(r.alfa)})${marca}`);
    });
    lineas.push('Gate: con escala multidimensional, TODAS las dimensiones deben alcanzar el umbral (0.70 por defecto), no solo el alfa global.');
  }

  lineas.push('');
  lineas.push('Nota: cálculo con varianza muestral (n-1), igual que SPSS. Contrasta con SPSS si tu asesor lo exige.');
  imprimirYGuardar(lineas, a.salida);
}

main();
