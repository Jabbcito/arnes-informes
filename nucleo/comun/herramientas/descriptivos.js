#!/usr/bin/env node
/**
 * Tablas de frecuencias y tablas cruzadas, con salida en Markdown lista para pegar.
 *
 * Entrada: CSV con encabezado; cada fila un caso, cada columna una variable
 * (ya categorizada: ej. columna "RedesSociales" con valores Bajo/Medio/Alto).
 *
 * Uso:
 *   node descriptivos.js datos.csv --frecuencia RedesSociales
 *   node descriptivos.js datos.csv --cruzada RedesSociales Rendimiento
 *   node descriptivos.js datos.csv --frecuencia RedesSociales --orden Bajo,Medio,Alto
 *   node descriptivos.js datos.csv --frecuencia RedesSociales --salida output/trabajo/calculo-tabla-1.md
 *
 * La salida es una tabla Markdown (formato del arnés: se le agrega número y
 * título según nucleo/comun/apa/tablas-figuras-apa.md al pegarla en informe.md).
 */
'use strict';
const { readCsvObjects } = require('./lib-csv');
const { imprimirYGuardar } = require('./lib-salida');

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--frecuencia') a.frecuencia = argv[++i];
    else if (arg === '--cruzada') { a.cruzada = [argv[++i], argv[++i]]; }
    else if (arg === '--orden') a.orden = argv[++i];
    else if (arg === '--salida') a.salida = argv[++i];
    else a.csv = arg;
  }
  if (!a.csv) { console.error('Uso: node descriptivos.js archivo.csv --frecuencia COL | --cruzada COL1 COL2'); process.exit(2); }
  return a;
}

function ordenCategorias(valores, orden) {
  if (orden) {
    const cats = orden.split(',').map((s) => s.trim());
    const extra = [...new Set(valores)].filter((v) => !cats.includes(v));
    return cats.concat(extra);
  }
  return [...new Set(valores)].sort();
}

function frecuencias(filas, col, orden) {
  const valores = filas.map((f) => (f[col] || '').trim()).filter((v) => v.length > 0);
  const n = valores.length;
  const cnt = {};
  for (const v of valores) cnt[v] = (cnt[v] || 0) + 1;
  const cats = ordenCategorias(valores, orden);

  const lineas = ['| Nivel | f | % | % válido | % acumulado |', '|---|---|---|---|---|'];
  let acum = 0;
  for (const c of cats) {
    const f = cnt[c] || 0;
    const pct = (100 * f) / n;
    acum += pct;
    lineas.push(`| ${c} | ${f} | ${pct.toFixed(1)} | ${pct.toFixed(1)} | ${acum.toFixed(1)} |`);
  }
  lineas.push(`| Total | ${n} | 100.0 | 100.0 | |`);
  lineas.push('');
  lineas.push(`(n = ${n}; casos vacíos excluidos: ${filas.length - n})`);
  return lineas;
}

function cruzada(filas, col1, col2, orden) {
  const pares = filas
    .map((f) => [(f[col1] || '').trim(), (f[col2] || '').trim()])
    .filter(([a, b]) => a.length > 0 && b.length > 0);
  const n = pares.length;
  const cats1 = ordenCategorias(pares.map((p) => p[0]), orden);
  const cats2 = ordenCategorias(pares.map((p) => p[1]), null);

  const cnt = {};
  for (const [a, b] of pares) {
    const key = `${a} ${b}`;
    cnt[key] = (cnt[key] || 0) + 1;
  }
  const get = (a, b) => cnt[`${a} ${b}`] || 0;

  const lineas = [`| ${col1} \\ ${col2} | ` + cats2.join(' | ') + ' | Total |', '|---'.repeat(cats2.length + 2) + '|'];
  for (const c1 of cats1) {
    const filaN = cats2.map((c2) => get(c1, c2));
    const tot = filaN.reduce((a, b) => a + b, 0);
    const celdas = filaN.map((v) => `${v} (${((100 * v) / n).toFixed(1)}%)`);
    lineas.push(`| ${c1} | ` + celdas.join(' | ') + ` | ${tot} (${((100 * tot) / n).toFixed(1)}%) |`);
  }
  const totCols = cats2.map((c2) => cats1.reduce((a, c1) => a + get(c1, c2), 0));
  lineas.push('| Total | ' + totCols.map((v) => `${v} (${((100 * v) / n).toFixed(1)}%)`).join(' | ') + ` | ${n} (100%) |`);
  return lineas;
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  const filas = readCsvObjects(a.csv);
  if (filas.length === 0) { console.error('CSV vacío o sin encabezado.'); process.exit(1); }
  const columnasDisponibles = Object.keys(filas[0]);

  let lineas;
  if (a.frecuencia) {
    if (!columnasDisponibles.includes(a.frecuencia)) {
      console.error(`Columna '${a.frecuencia}' no existe. Columnas: ${columnasDisponibles}`);
      process.exit(1);
    }
    lineas = frecuencias(filas, a.frecuencia, a.orden);
  } else if (a.cruzada) {
    for (const c of a.cruzada) {
      if (!columnasDisponibles.includes(c)) {
        console.error(`Columna '${c}' no existe. Columnas: ${columnasDisponibles}`);
        process.exit(1);
      }
    }
    lineas = cruzada(filas, a.cruzada[0], a.cruzada[1], a.orden);
  } else {
    console.error('Usa --frecuencia COL o --cruzada COL1 COL2');
    process.exit(2);
  }
  imprimirYGuardar(lineas, a.salida);
}

main();
