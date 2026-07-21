#!/usr/bin/env node
/**
 * Chi-cuadrado de independencia sobre una tabla de contingencia, con V de
 * Cramér (tamaño del efecto) — inspirado en cómo SPSS Crosstabs muestra el
 * estadístico junto a la tabla, en vez de exigir un paso aparte.
 *
 * Entrada: CSV con encabezado, dos columnas categóricas (mismo formato que
 * espera `descriptivos.js --cruzada`).
 *
 * Uso:
 *   node chi-cuadrado.js datos.csv --x RS_nivel --y RA_nivel
 *   node chi-cuadrado.js datos.csv --x RS_nivel --y RA_nivel --salida output/trabajo/calculo-chi2.md
 *
 * Método: estadístico de Pearson X² = Σ (O-E)²/E sobre la tabla de
 * contingencia observada/esperada; p-valor vía la función gamma incompleta
 * regularizada (lib-stats.js, mismo estilo Numerical Recipes que ya usa
 * pBilateralT). V de Cramér = sqrt(X² / (n · min(filas-1, columnas-1))).
 * Para tablas con frecuencias esperadas muy bajas (<5 en más del 20% de
 * celdas) el resultado es menos confiable — se avisa explícitamente, y ahí
 * conviene contrastar con SPSS/Jamovi (test exacto de Fisher).
 */
'use strict';
const { readCsvObjects } = require('./lib-csv');
const { pChiCuadrado } = require('./lib-stats');
const { imprimirYGuardar } = require('./lib-salida');

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--x') a.x = argv[++i];
    else if (arg === '--y') a.y = argv[++i];
    else if (arg === '--salida') a.salida = argv[++i];
    else a.csv = arg;
  }
  if (!a.csv || !a.x || !a.y) {
    console.error('Uso: node chi-cuadrado.js archivo.csv --x COL1 --y COL2 [--salida ruta]');
    process.exit(2);
  }
  return a;
}

function interpretarV(v) {
  if (v >= 0.5) return 'grande';
  if (v >= 0.3) return 'mediano';
  if (v >= 0.1) return 'pequeño';
  return 'insignificante';
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  const filas = readCsvObjects(a.csv);
  const pares = filas
    .map((f) => [(f[a.x] || '').trim(), (f[a.y] || '').trim()])
    .filter(([x, y]) => x.length > 0 && y.length > 0);
  const n = pares.length;
  if (n < 5) { console.error('Se necesitan al menos 5 casos.'); process.exit(1); }

  const catsX = [...new Set(pares.map((p) => p[0]))].sort();
  const catsY = [...new Set(pares.map((p) => p[1]))].sort();

  const obs = {};
  for (const [x, y] of pares) obs[`${x}|${y}`] = (obs[`${x}|${y}`] || 0) + 1;
  const get = (x, y) => obs[`${x}|${y}`] || 0;

  const totFila = Object.fromEntries(catsX.map((x) => [x, catsY.reduce((s, y) => s + get(x, y), 0)]));
  const totCol = Object.fromEntries(catsY.map((y) => [y, catsX.reduce((s, x) => s + get(x, y), 0)]));

  let x2 = 0;
  let celdasBajas = 0;
  const totalCeldas = catsX.length * catsY.length;
  for (const x of catsX) {
    for (const y of catsY) {
      const o = get(x, y);
      const e = (totFila[x] * totCol[y]) / n;
      if (e < 5) celdasBajas += 1;
      x2 += ((o - e) ** 2) / e;
    }
  }

  const gl = (catsX.length - 1) * (catsY.length - 1);
  const p = pChiCuadrado(x2, gl);
  const k = Math.min(catsX.length - 1, catsY.length - 1);
  const v = Math.sqrt(x2 / (n * k));

  const lineas = [
    `Tabla de contingencia: ${a.x} (${catsX.length} niveles) × ${a.y} (${catsY.length} niveles), n = ${n}`,
    'Fórmula: X² = Σ (O-E)²/E, con E = (total fila × total columna) / n',
    `X² = ${x2.toFixed(3)} | gl = ${gl} | p = ${p.toFixed(4)}`,
    `V de Cramér = ${v.toFixed(3)} (tamaño del efecto ${interpretarV(v)})`,
    '',
    `Interpretación: ${p < 0.05 ? 'existe asociación significativa' : 'NO existe asociación significativa'} entre ${a.x} y ${a.y} al 0.05.`,
    '',
    `Reporte sugerido: (X²(${gl}, N=${n})=${x2.toFixed(2)}; p=${p < 0.001 ? '<0.001' : p.toFixed(3)}; V=${v.toFixed(2)})`,
  ];
  if (celdasBajas > 0) {
    lineas.push('', `ADVERTENCIA: ${celdasBajas} de ${totalCeldas} celdas tienen frecuencia esperada < 5 — el chi-cuadrado es menos confiable en ese caso; contrasta con la prueba exacta de Fisher en SPSS/Jamovi.`);
  }
  imprimirYGuardar(lineas, a.salida);
}

main();
