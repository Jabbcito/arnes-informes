#!/usr/bin/env node
/**
 * Crea, si no existen, todas las carpetas que un proyecto del alumno necesita
 * para trabajar con el arnés (ver "Qué genera el arnés en tu proyecto" en
 * README.md). Idempotente: correrlo varias veces no borra ni toca nada que
 * ya exista, solo crea lo que falte.
 *
 * Se corre una sola vez, al empezar un proyecto nuevo (o al retomar uno que
 * se creó antes de que este script existiera):
 *   node comun/herramientas/inicializar_proyecto.js
 *
 * Cada carpeta creada recibe un .gitkeep vacío (para que Git la trackee
 * aunque esté vacía) — no se sobreescribe si ya existe.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const CARPETAS = [
  'insumos',
  'fuentes',
  'fuentes/pdfs',
  'anexos/imagenes',
  'output/trabajo',
  'output/entregables',
];

function main() {
  const raiz = process.cwd();
  const creadas = [];
  const yaExistian = [];

  for (const rel of CARPETAS) {
    const abs = path.join(raiz, rel);
    const existiaAntes = fs.existsSync(abs);
    fs.mkdirSync(abs, { recursive: true });
    const gitkeep = path.join(abs, '.gitkeep');
    if (!fs.existsSync(gitkeep)) fs.writeFileSync(gitkeep, '');
    (existiaAntes ? yaExistian : creadas).push(rel);
  }

  if (creadas.length) {
    console.log('Carpetas creadas:');
    for (const c of creadas) console.log(`  - ${c}/`);
  }
  if (yaExistian.length) {
    console.log('Carpetas que ya existían (sin tocar su contenido):');
    for (const c of yaExistian) console.log(`  - ${c}/`);
  }
  console.log('\nListo. Estructura de carpetas del proyecto verificada.');
}

main();
