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
 *
 * Imprime varianzas por ítem y el cálculo paso a paso. Sin dependencias externas.
 */
'use strict';
const { readCsv } = require('./lib-csv');
const { varianceSample } = require('./lib-stats');

function parseArgs(argv) {
  const a = { kr20: false, sinEncabezado: false };
  for (const arg of argv) {
    if (arg === '--kr20') a.kr20 = true;
    else if (arg === '--sin-encabezado') a.sinEncabezado = true;
    else a.csv = arg;
  }
  if (!a.csv) { console.error('Uso: node confiabilidad.js archivo.csv [--kr20] [--sin-encabezado]'); process.exit(2); }
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
  console.log(`Encuestados: ${n} | Ítems: ${k}`);

  let coef, nombre;
  if (a.kr20) {
    const r = kr20(datos);
    console.log('Fórmula KR-20: (k/(k-1)) · (1 - Σp·q / Vt)');
    console.log(`  Σp·q = ${r.sumPq.toFixed(4)} | Vt = ${r.varTotal.toFixed(4)}`);
    coef = r.coef; nombre = 'KR-20';
  } else {
    const r = alfaCronbach(datos);
    console.log('Fórmula alfa de Cronbach: (k/(k-1)) · (1 - ΣVi / Vt)');
    console.log('  Varianza por ítem: ' + r.varItems.map((v) => v.toFixed(4)).join(', '));
    console.log(`  ΣVi = ${r.sumVi.toFixed(4)} | Vt (varianza de totales) = ${r.varTotal.toFixed(4)}`);
    coef = r.alfa; nombre = 'Alfa de Cronbach';
  }

  console.log(`\n${nombre} = ${coef.toFixed(3)}  → confiabilidad ${interpretar(coef)}`);
  console.log('\nNota: cálculo con varianza muestral (n-1), igual que SPSS. Contrasta con SPSS si tu asesor lo exige.');
}

main();
