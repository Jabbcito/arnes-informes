#!/usr/bin/env node
/**
 * ANOVA de un factor (un factor categórico de 3+ grupos, una variable
 * numérica dependiente), con eta cuadrado (tamaño del efecto).
 *
 * Entrada: CSV con encabezado, una columna de grupo (3+ categorías) y una
 * columna numérica dependiente.
 *
 * Uso:
 *   node anova.js datos.csv --grupo Turno --valor Puntaje
 *   node anova.js datos.csv --grupo Turno --valor Puntaje --salida output/trabajo/calculo-anova.md
 *
 * Método: suma de cuadrados entre grupos (SC_entre) y dentro de grupos
 * (SC_dentro) de la forma clásica; F = (SC_entre/gl_entre) / (SC_dentro/gl_dentro);
 * p-valor vía la distribución F (relación con la beta incompleta regularizada
 * que ya usa correlacion.js/prueba-t.js, en lib-stats.js: pF). Eta cuadrado =
 * SC_entre / SC_total. Sin comparaciones post-hoc (Tukey, Bonferroni, etc.):
 * si el ANOVA sale significativo y se necesita saber QUÉ pares de grupos
 * difieren, eso se corre en SPSS/Jamovi — implementarlo mal es más riesgoso
 * que no tenerlo.
 */
'use strict';
const { readCsvObjects } = require('./lib-csv');
const { mean, pF } = require('./lib-stats');
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
    console.error('Uso: node anova.js archivo.csv --grupo COL_GRUPO --valor COL_NUMERICA [--salida ruta]');
    process.exit(2);
  }
  return a;
}

function interpretarEta2(e2) {
  if (e2 >= 0.14) return 'grande';
  if (e2 >= 0.06) return 'mediano';
  if (e2 >= 0.01) return 'pequeño';
  return 'insignificante';
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  const filas = readCsvObjects(a.csv);
  const validas = filas.filter((f) => (f[a.grupo] || '').trim() !== '' && !Number.isNaN(Number(f[a.valor])));
  const nombresGrupo = [...new Set(validas.map((f) => f[a.grupo].trim()))].sort();
  if (nombresGrupo.length < 3) {
    console.error(`ANOVA de un factor necesita 3+ grupos (encontrados: ${nombresGrupo.length}). Para 2 grupos usa prueba-t.js.`);
    process.exit(1);
  }

  const grupos = nombresGrupo.map((g) => ({
    nombre: g,
    xs: validas.filter((f) => f[a.grupo].trim() === g).map((f) => Number(f[a.valor])),
  }));
  if (grupos.some((g) => g.xs.length < 2)) {
    console.error('Cada grupo necesita al menos 2 casos.');
    process.exit(1);
  }

  const todos = grupos.flatMap((g) => g.xs);
  const N = todos.length;
  const granMedia = mean(todos);
  const k = grupos.length;

  let scEntre = 0, scDentro = 0;
  const filasTabla = [];
  for (const g of grupos) {
    const m = mean(g.xs);
    scEntre += g.xs.length * (m - granMedia) ** 2;
    const scg = g.xs.reduce((acc, x) => acc + (x - m) ** 2, 0);
    scDentro += scg;
    filasTabla.push({ nombre: g.nombre, n: g.xs.length, media: m, sc: scg });
  }
  const scTotal = scEntre + scDentro;
  const glEntre = k - 1;
  const glDentro = N - k;
  const cmEntre = scEntre / glEntre;
  const cmDentro = scDentro / glDentro;
  const F = cmEntre / cmDentro;
  const p = pF(F, glEntre, glDentro);
  const eta2 = scEntre / scTotal;

  const lineas = ['Medias por grupo:'];
  for (const f of filasTabla) lineas.push(`  ${f.nombre}: n=${f.n}, media=${f.media.toFixed(3)}`);
  lineas.push(
    '',
    'Fórmula: F = CM_entre / CM_dentro, con CM = SC/gl',
    `SC_entre = ${scEntre.toFixed(4)} | gl_entre = ${glEntre} | CM_entre = ${cmEntre.toFixed(4)}`,
    `SC_dentro = ${scDentro.toFixed(4)} | gl_dentro = ${glDentro} | CM_dentro = ${cmDentro.toFixed(4)}`,
    `F = ${F.toFixed(3)} | p = ${p.toFixed(4)}`,
    `Eta cuadrado = ${eta2.toFixed(3)} (tamaño del efecto ${interpretarEta2(eta2)})`,
    '',
    `Interpretación: hay diferencia ${p < 0.05 ? '' : 'NO '}estadísticamente significativa entre los grupos de "${a.grupo}" al 0.05.`,
    '',
    `Reporte sugerido: (F(${glEntre},${glDentro})=${F.toFixed(2)}; p=${p < 0.001 ? '<0.001' : p.toFixed(3)}; η²=${eta2.toFixed(2)})`,
    '',
    'Nota: no incluye comparaciones post-hoc (Tukey, Bonferroni, etc.) — si el ANOVA es significativo y hace falta saber qué pares de grupos difieren, correrlo en SPSS/Jamovi.',
  );
  imprimirYGuardar(lineas, a.salida);
}

main();
