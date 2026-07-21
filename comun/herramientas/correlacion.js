#!/usr/bin/env node
/**
 * Correlación de Pearson y Spearman con p-valor bilateral aproximado.
 *
 * Entrada: CSV con encabezado, dos columnas numéricas (o más; se eligen dos).
 *
 * Uso:
 *   node correlacion.js datos.csv --x PuntajeRS --y PuntajeRA            # Spearman (default)
 *   node correlacion.js datos.csv --x PuntajeRS --y PuntajeRA --pearson
 *   node correlacion.js datos.csv --x PuntajeRS --y PuntajeRA --salida output/trabajo/calculo-tabla-4.md
 *
 * Método del p-valor: estadístico t = r·sqrt((n-2)/(1-r²)) contra la
 * distribución t de Student con n-2 grados de libertad (CDF calculada con la
 * función beta incompleta regularizada, en lib-stats.js). Misma aproximación
 * que usan los paquetes estadísticos para Spearman con n moderado; para n<10
 * o decisiones límite, contrastar con SPSS/Jamovi.
 */
'use strict';
const { readCsvObjects } = require('./lib-csv');
const { pBilateralT } = require('./lib-stats');
const { imprimirYGuardar } = require('./lib-salida');

function parseArgs(argv) {
  const a = { pearson: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--x') a.x = argv[++i];
    else if (arg === '--y') a.y = argv[++i];
    else if (arg === '--pearson') a.pearson = true;
    else if (arg === '--salida') a.salida = argv[++i];
    else a.csv = arg;
  }
  if (!a.csv || !a.x || !a.y) {
    console.error('Uso: node correlacion.js archivo.csv --x COL1 --y COL2 [--pearson]');
    process.exit(2);
  }
  return a;
}

function pearson(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  return sxy / Math.sqrt(sxx * syy);
}

function rangos(v) {
  const orden = v.map((_, i) => i).sort((i, j) => v[i] - v[j]);
  const r = new Array(v.length).fill(0);
  let i = 0;
  while (i < orden.length) {
    let j = i;
    while (j + 1 < orden.length && v[orden[j + 1]] === v[orden[i]]) j++;
    const promedio = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) r[orden[k]] = promedio;
    i = j + 1;
  }
  return r;
}

function spearman(xs, ys) {
  return pearson(rangos(xs), rangos(ys));
}

function interpretarRho(r) {
  const a = Math.abs(r);
  let g;
  if (a >= 0.9) g = 'muy alta';
  else if (a >= 0.7) g = 'alta';
  else if (a >= 0.4) g = 'moderada';
  else if (a >= 0.2) g = 'baja';
  else g = 'muy baja / nula';
  const sentido = r > 0 ? 'directa (positiva)' : r < 0 ? 'inversa (negativa)' : 'nula';
  return `correlación ${g}, ${sentido}`;
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  const filas = readCsvObjects(a.csv);
  const pares = filas
    .map((f) => [Number(f[a.x]), Number(f[a.y])])
    .filter((p, i) => (filas[i][a.x] || '').trim() !== '' && (filas[i][a.y] || '').trim() !== '' && !Number.isNaN(p[0]) && !Number.isNaN(p[1]));
  const xs = pares.map((p) => p[0]);
  const ys = pares.map((p) => p[1]);
  const n = xs.length;
  if (n < 4) { console.error('Se necesitan al menos 4 pares de datos.'); process.exit(1); }

  let r, nombre;
  if (a.pearson) { r = pearson(xs, ys); nombre = 'r de Pearson'; }
  else { r = spearman(xs, ys); nombre = 'rho de Spearman'; }

  const gl = n - 2;
  let p;
  if (Math.abs(r) >= 1.0) p = 0.0;
  else {
    const t = r * Math.sqrt(gl / (1.0 - r * r));
    p = pBilateralT(Math.abs(t), gl);
  }

  const rLabel = a.pearson ? 'r' : 'rho';
  const pLabel = p < 0.001 ? '<0.001' : p.toFixed(3);
  const lineas = [
    `n = ${n} | gl = ${gl}`,
    `${nombre} = ${r.toFixed(3)}`,
    `p (bilateral, aprox. t) = ${p.toFixed(4)}`,
    `Interpretación: ${interpretarRho(r)}; ` + (p < 0.05 ? 'significativa al 0.05' : 'NO significativa al 0.05'),
    '',
    `Reporte sugerido: (${rLabel}=${r.toFixed(3)}; p=${pLabel})`,
    'Nota: para n pequeño o valores límite, contrastar con SPSS/Jamovi.',
  ];
  imprimirYGuardar(lineas, a.salida);
}

main();
