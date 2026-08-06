#!/usr/bin/env node
/**
 * Correlación de Pearson y Spearman con p-valor bilateral aproximado e
 * intervalo de confianza al 95% del coeficiente (transformación Fisher z).
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
 *
 * IC 95%: z = artanh(r), se = 1/sqrt(n-3) → intervalo en z → vuelta a r con
 * tanh (transformación Fisher z, método estándar; para Spearman es la
 * aproximación habitual — contrastar con SPSS para valores límite).
 */
'use strict';
const { readCsvObjects } = require('./lib-csv');
const { pBilateralT, pearson } = require('./lib-stats');
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

// IC 95% del coeficiente vía transformación Fisher z (válido para Pearson;
// aproximación habitual para Spearman con n moderado).
function icFisherZ(r, n) {
  const z = 0.5 * Math.log((1 + r) / (1 - r));
  const se = 1 / Math.sqrt(n - 3);
  return { lo: Math.tanh(z - 1.96 * se), hi: Math.tanh(z + 1.96 * se) };
}

// Formato APA 7: sin cero inicial (.960, -.960), preservando el signo negativo.
function sinCeroInicial(s) {
  return s.replace(/^(-?)0/, '$1');
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
  const totales = filas.length;
  const pares = filas
    .map((f) => [Number(f[a.x]), Number(f[a.y])])
    .filter((p, i) => (filas[i][a.x] || '').trim() !== '' && (filas[i][a.y] || '').trim() !== '' && !Number.isNaN(p[0]) && !Number.isNaN(p[1]));
  const excluidos = totales - pares.length;
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
  const pLabel = p < 0.001 ? '<.001' : p.toFixed(3);
  let ic = null;
  const lineas = [
    `n = ${n} | gl = ${gl}${excluidos > 0 ? ` | casos excluidos por valores faltantes: ${excluidos} de ${totales}` : ''}`,
    `${nombre} = ${r.toFixed(3)}`,
    `p (bilateral, aprox. t) = ${p.toFixed(4)}`,
  ];

  if (Math.abs(r) < 1.0 && n > 3) {
    ic = icFisherZ(r, n);
    lineas.push(`IC 95% (Fisher z) = [${ic.lo.toFixed(3)}, ${ic.hi.toFixed(3)}]`);
  } else {
    lineas.push('IC 95%: no calculable (|r| = 1).');
  }

  lineas.push(`Interpretación: ${interpretarRho(r)}; ` + (p < 0.05 ? 'significativa al 0.05' : 'NO significativa al 0.05'));
  lineas.push('');
  lineas.push(`Reporte APA 7 sugerido: ${rLabel}(${gl}) = ${sinCeroInicial(r.toFixed(3))}, 95% CI [${ic ? sinCeroInicial(ic.lo.toFixed(3)) : '?'}, ${ic ? sinCeroInicial(ic.hi.toFixed(3)) : '?'}], p ${pLabel === '<.001' ? '< .001' : '= ' + pLabel}`);
  lineas.push('Nota: correlación no implica causalidad; en datos transversales no se puede afirmar mediación ni dirección de la relación (ver nucleo/tesis/contenido/discusion.md).');
  lineas.push('Nota: para n pequeño o valores límite, contrastar con SPSS/Jamovi.');
  imprimirYGuardar(lineas, a.salida);
}

main();
