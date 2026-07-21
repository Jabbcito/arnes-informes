#!/usr/bin/env node
/**
 * Estadísticos descriptivos para una variable numérica cruda (no
 * categorizada): media, mediana, moda, desviación estándar, mínimo, máximo, n.
 * Equivalente al procedimiento "Descriptives" de SPSS — hoy `descriptivos.js`
 * solo tabula variables YA categorizadas (Bajo/Medio/Alto); este script cubre
 * el hueco de resumir una variable numérica cruda (edad, puntaje total, etc.).
 *
 * Entrada: CSV con encabezado, una columna numérica.
 *
 * Uso:
 *   node descriptivos-numericos.js datos.csv --columna Edad
 *   node descriptivos-numericos.js datos.csv --columna Edad --salida output/trabajo/calculo-descriptivos.md
 */
'use strict';
const { readCsvObjects } = require('./lib-csv');
const { mean, median, mode, standardDeviation } = require('./lib-stats');
const { imprimirYGuardar } = require('./lib-salida');

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--columna') a.columna = argv[++i];
    else if (arg === '--salida') a.salida = argv[++i];
    else a.csv = arg;
  }
  if (!a.csv || !a.columna) {
    console.error('Uso: node descriptivos-numericos.js archivo.csv --columna COL [--salida ruta]');
    process.exit(2);
  }
  return a;
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  const filas = readCsvObjects(a.csv);
  if (filas.length === 0) { console.error('CSV vacío o sin encabezado.'); process.exit(1); }
  if (!Object.keys(filas[0]).includes(a.columna)) {
    console.error(`Columna '${a.columna}' no existe. Columnas: ${Object.keys(filas[0])}`);
    process.exit(1);
  }
  const xs = filas
    .map((f) => Number((f[a.columna] || '').trim()))
    .filter((v, i) => (filas[i][a.columna] || '').trim() !== '' && !Number.isNaN(v));
  const vacios = filas.length - xs.length;
  if (xs.length < 2) { console.error('Se necesitan al menos 2 valores numéricos válidos.'); process.exit(1); }

  const m = mean(xs);
  const med = median(xs);
  const mo = mode(xs);
  const de = standardDeviation(xs);
  const min = Math.min(...xs);
  const max = Math.max(...xs);

  const lineas = [
    `| Estadístico | Valor |`,
    `|---|---|`,
    `| n | ${xs.length} |`,
    `| Media | ${m.toFixed(3)} |`,
    `| Mediana | ${med.toFixed(3)} |`,
    `| Moda | ${mo.length > 1 ? mo.map((v) => v.toFixed(2)).join(', ') + ' (multimodal)' : mo[0].toFixed(3)} |`,
    `| Desviación estándar | ${de.toFixed(3)} |`,
    `| Mínimo | ${min} |`,
    `| Máximo | ${max} |`,
    '',
    `(n = ${xs.length}; casos vacíos/no numéricos excluidos: ${vacios})`,
  ];
  imprimirYGuardar(lineas, a.salida);
}

main();
