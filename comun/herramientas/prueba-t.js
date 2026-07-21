#!/usr/bin/env node
/**
 * t de Student para dos muestras independientes (Welch, no asume varianzas
 * iguales — más robusto y no exige correr antes una prueba de igualdad de
 * varianzas), con d de Cohen (tamaño del efecto).
 *
 * Entrada: CSV con encabezado, una columna de grupo (2 categorías) y una
 * columna numérica dependiente.
 *
 * Uso:
 *   node prueba-t.js datos.csv --grupo Sexo --valor Puntaje
 *   node prueba-t.js datos.csv --grupo Sexo --valor Puntaje --salida output/trabajo/calculo-t.md
 *
 * Método: t de Welch = (media1-media2) / sqrt(var1/n1 + var2/n2); grados de
 * libertad por la aproximación de Welch-Satterthwaite; p-valor bilateral vía
 * la misma beta incompleta regularizada que ya usa correlacion.js
 * (lib-stats.js). d de Cohen con la desviación estándar combinada (pooled).
 */
'use strict';
const { readCsvObjects } = require('./lib-csv');
const { mean, varianceSample, pBilateralT } = require('./lib-stats');
const { imprimirYGuardar } = require('./lib-salida');

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--grupo') a.grupo = argv[++i];
    else if (arg === '--valor') a.valor = argv[++i];
    else if (arg === '--salida') a.salida = argv[++i];
    else a.csv = arg;
  }
  if (!a.csv || !a.grupo || !a.valor) {
    console.error('Uso: node prueba-t.js archivo.csv --grupo COL_GRUPO --valor COL_NUMERICA [--salida ruta]');
    process.exit(2);
  }
  return a;
}

function interpretarD(d) {
  const ad = Math.abs(d);
  if (ad >= 0.8) return 'grande';
  if (ad >= 0.5) return 'mediano';
  if (ad >= 0.2) return 'pequeño';
  return 'insignificante';
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  const filas = readCsvObjects(a.csv);
  const validas = filas.filter((f) => (f[a.grupo] || '').trim() !== '' && !Number.isNaN(Number(f[a.valor])));
  const grupos = [...new Set(validas.map((f) => f[a.grupo].trim()))];
  if (grupos.length !== 2) {
    console.error(`La columna --grupo debe tener exactamente 2 categorías (encontradas: ${grupos.length} — ${grupos.join(', ')}).`);
    process.exit(1);
  }

  const [g1, g2] = grupos;
  const xs1 = validas.filter((f) => f[a.grupo].trim() === g1).map((f) => Number(f[a.valor]));
  const xs2 = validas.filter((f) => f[a.grupo].trim() === g2).map((f) => Number(f[a.valor]));
  const n1 = xs1.length, n2 = xs2.length;
  if (n1 < 2 || n2 < 2) { console.error('Se necesitan al menos 2 casos por grupo.'); process.exit(1); }

  const m1 = mean(xs1), m2 = mean(xs2);
  const v1 = varianceSample(xs1), v2 = varianceSample(xs2);

  const se = Math.sqrt(v1 / n1 + v2 / n2);
  const t = (m1 - m2) / se;
  const gl = ((v1 / n1 + v2 / n2) ** 2) / (((v1 / n1) ** 2) / (n1 - 1) + ((v2 / n2) ** 2) / (n2 - 1));
  const p = pBilateralT(Math.abs(t), gl);

  const sPooled = Math.sqrt(((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2));
  const d = (m1 - m2) / sPooled;

  const lineas = [
    `Grupo "${g1}": n=${n1}, media=${m1.toFixed(3)}, DE=${Math.sqrt(v1).toFixed(3)}`,
    `Grupo "${g2}": n=${n2}, media=${m2.toFixed(3)}, DE=${Math.sqrt(v2).toFixed(3)}`,
    'Fórmula (t de Welch): t = (media1-media2) / sqrt(var1/n1 + var2/n2)',
    `t = ${t.toFixed(3)} | gl (Welch-Satterthwaite) = ${gl.toFixed(2)} | p (bilateral) = ${p.toFixed(4)}`,
    `d de Cohen = ${d.toFixed(3)} (tamaño del efecto ${interpretarD(d)})`,
    '',
    `Interpretación: la diferencia de medias entre "${g1}" y "${g2}" es ${p < 0.05 ? '' : 'NO '}estadísticamente significativa al 0.05.`,
    '',
    `Reporte sugerido: (t(${gl.toFixed(1)})=${t.toFixed(2)}; p=${p < 0.001 ? '<0.001' : p.toFixed(3)}; d=${d.toFixed(2)})`,
    '',
    'Nota: t de Welch (no asume varianzas iguales); no requiere correr antes una prueba de homogeneidad de varianzas. Para decisiones límite, contrastar con SPSS/Jamovi.',
  ];
  imprimirYGuardar(lineas, a.salida);
}

main();
