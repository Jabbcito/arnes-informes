#!/usr/bin/env node
/**
 * Validez de contenido por Juicio de Expertos: V de Aiken.
 *
 * Entrada: CSV donde cada FILA es un ítem del instrumento y cada COLUMNA es
 * la calificación de un juez real (escala 1..c, por defecto c=4: no cumple /
 * bajo / medio / alto). Con encabezado o sin él (--sin-encabezado).
 *
 * Uso:
 *   node validez-contenido.js juicio-expertos.csv                      # V de Aiken, c=4
 *   node validez-contenido.js juicio-expertos.csv --categorias 5       # escala 1-5
 *   node validez-contenido.js juicio-expertos.csv --umbral 0.75        # gate distinto a 0.80
 *   node validez-contenido.js juicio-expertos.csv --salida output/trabajo/calculo-aiken.md
 *
 * Este script NUNCA genera ni estima calificaciones de jueces — solo procesa
 * datos reales que el alumno transcribe de su asesor y jueces (regla 17 y la
 * regla de fidelidad de datos de AGENTS.md: nunca inventar resultados).
 */
'use strict';
const { readCsv } = require('./lib-csv');
const { imprimirYGuardar } = require('./lib-salida');

function parseArgs(argv) {
  const a = { sinEncabezado: false, categorias: 4, umbral: 0.8 };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--sin-encabezado') a.sinEncabezado = true;
    else if (arg === '--categorias') a.categorias = Number(argv[++i]);
    else if (arg === '--umbral') a.umbral = Number(argv[++i]);
    else if (arg === '--salida') a.salida = argv[++i];
    else a.csv = arg;
  }
  if (!a.csv) {
    console.error('Uso: node validez-contenido.js juicio-expertos.csv [--categorias 4] [--umbral 0.80] [--sin-encabezado] [--salida ruta.md]');
    process.exit(2);
  }
  if (a.categorias < 2) {
    console.error('ERROR: --categorias debe ser al menos 2.');
    process.exit(2);
  }
  return a;
}

function cargarDatos(ruta, conEncabezado, categorias) {
  let filas = readCsv(ruta);
  if (conEncabezado) filas = filas.slice(1);
  const datos = filas.map((f) => f.map(Number));
  if (datos.length === 0) {
    console.error('ERROR: el CSV no tiene filas de ítems.');
    process.exit(1);
  }
  const n = datos[0].length;
  if (datos.some((f) => f.length !== n)) {
    console.error('ERROR: todas las filas (ítems) deben tener la misma cantidad de columnas (jueces).');
    process.exit(1);
  }
  if (datos.some((f) => f.some((v) => Number.isNaN(v)))) {
    console.error('ERROR: hay celdas no numéricas en el CSV.');
    process.exit(1);
  }
  if (datos.some((f) => f.some((v) => v < 1 || v > categorias))) {
    console.error(`ERROR: hay calificaciones fuera del rango 1..${categorias} (--categorias). Revisa el CSV o ajusta --categorias.`);
    process.exit(1);
  }
  return datos;
}

// V de Aiken por ítem: S = suma de (calificación - 1) sobre todos los jueces;
// V = S / (n·(c-1)), con n = nº de jueces, c = nº de categorías de la escala.
function aikenPorItem(fila, categorias) {
  const n = fila.length;
  const s = fila.reduce((acc, v) => acc + (v - 1), 0);
  return s / (n * (categorias - 1));
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  const datos = cargarDatos(a.csv, !a.sinEncabezado, a.categorias);
  const nItems = datos.length;
  const nJueces = datos[0].length;

  const lineas = [
    `Ítems: ${nItems} | Jueces: ${nJueces} | Categorías de la escala: 1-${a.categorias}`,
    'Fórmula V de Aiken: V = S / (n·(c-1))  —  S: suma de (calificación-1) de los jueces; n: nº de jueces; c: nº de categorías',
    '',
  ];

  const vs = [];
  const problematicos = [];
  datos.forEach((fila, i) => {
    const v = aikenPorItem(fila, a.categorias);
    vs.push(v);
    const marca = v < a.umbral ? '  ← revisar/reformular' : '';
    if (v < a.umbral) problematicos.push(i + 1);
    lineas.push(`  Ítem ${i + 1}: calificaciones [${fila.join(', ')}] → V = ${v.toFixed(3)}${marca}`);
  });

  const vGlobal = vs.reduce((acc, v) => acc + v, 0) / vs.length;
  lineas.push('');
  lineas.push(`V de Aiken promedio del instrumento = ${vGlobal.toFixed(3)}`);
  lineas.push('');
  if (problematicos.length === 0) {
    lineas.push(`Todos los ítems alcanzan el umbral (V ≥ ${a.umbral}). Instrumento validado por juicio de expertos — se puede continuar con el piloto.`);
  } else {
    lineas.push(`Ítems bajo el umbral (V < ${a.umbral}): ${problematicos.join(', ')} — reformular o eliminar y repetir la ficha con los jueces antes de pasar al piloto.`);
  }
  lineas.push('');
  lineas.push('Nota: umbral estándar 0.80; si el asesor o la universidad exige otro, ajustar en output/trabajo/brief.md y aplicar aquí con --umbral.');

  imprimirYGuardar(lineas, a.salida);
}

main();
