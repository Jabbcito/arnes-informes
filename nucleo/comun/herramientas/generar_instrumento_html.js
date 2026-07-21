#!/usr/bin/env node
/**
 * Genera una versión HTML autocontenida e imprimible (formato de encuesta
 * física) a partir de output/trabajo/instrumento.md, para que el alumno la
 * imprima (Ctrl+P -> Guardar como PDF) y aplique el piloto en papel.
 *
 * Uso:
 *   node generar_instrumento_html.js output/trabajo/instrumento.md --salida output/entregables/instrumento.html
 *   node generar_instrumento_html.js output/trabajo/instrumento.md --salida output/entregables/instrumento.html \
 *     --universidad "Universidad X" --carrera "Ingeniería de Sistemas" --autor "Nombre Apellido"
 *
 * Parsea el instrumento.md con el formato ya usado por la skill
 * construir-instrumento: un título "# Instrumento — ...", una línea "Tipo de
 * instrumento: ..." (se usa como nota de escala) y una o más secciones
 * "## Variable N: Nombre" seguidas de una tabla Markdown "| # | Ítem | ... |".
 * Sin dependencias externas — mismo estilo que el resto de comun/herramientas/.
 */
'use strict';
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--salida') a.salida = argv[++i];
    else if (arg === '--universidad') a.universidad = argv[++i];
    else if (arg === '--carrera') a.carrera = argv[++i];
    else if (arg === '--autor') a.autor = argv[++i];
    else if (arg === '--titulo') a.titulo = argv[++i];
    else if (!a.entrada) a.entrada = arg;
    else { console.error(`Argumento no reconocido: ${arg}`); process.exit(2); }
  }
  if (!a.entrada) {
    console.error('Uso: node generar_instrumento_html.js <instrumento.md> [--salida <ruta.html>] [--universidad ..] [--carrera ..] [--autor ..] [--titulo ..]');
    process.exit(2);
  }
  if (!a.salida) {
    // Regla 29 de AGENTS.md: todo lo que el arnés genera vive dentro de
    // output/ — si no se indica --salida, cae en output/entregables/ por
    // defecto en vez de en la carpeta actual o una ruta temporal.
    a.salida = path.join('output', 'entregables', 'instrumento.html');
    console.error(`(sin --salida: se usa el valor por defecto ${a.salida})`);
  }
  return a;
}

function escaparHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function parseInstrumento(texto) {
  const lineas = texto.split('\n');
  let titulo = null;
  let notaEscala = null;
  const secciones = [];
  let seccionActual = null;

  for (let i = 0; i < lineas.length; i++) {
    const l = lineas[i].trim();
    const mTitulo = l.match(/^#\s+(.+)$/);
    const mSeccion = l.match(/^##\s+(.+)$/);
    const mFila = l.match(/^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*(.*?)\s*\|$/);

    if (mTitulo && !titulo) {
      titulo = mTitulo[1].trim();
    } else if (mSeccion) {
      seccionActual = { nombre: mSeccion[1].trim(), items: [] };
      secciones.push(seccionActual);
    } else if (mFila && seccionActual) {
      const numero = mFila[1];
      if (numero === '#') continue; // fila de encabezado de tabla
      const item = mFila[2].trim();
      const dimension = mFila[3].trim();
      if (/^-+$/.test(item.replace(/\s/g, ''))) continue; // fila separadora ---|---|---
      seccionActual.items.push({ numero, item, dimension });
    } else if (!notaEscala && /^Tipo de instrumento:/i.test(l)) {
      notaEscala = l.replace(/^Tipo de instrumento:\s*/i, '').trim();
    }
  }
  return { titulo, notaEscala, secciones: secciones.filter((s) => s.items.length > 0) };
}

function construirHtml({ titulo, notaEscala, secciones }, opts) {
  const tituloFinal = escaparHtml(opts.titulo || titulo || 'Instrumento de recolección de datos');
  const universidad = escaparHtml(opts.universidad || '[Universidad]');
  const carrera = escaparHtml(opts.carrera || '[Carrera / Escuela profesional]');
  const autor = escaparHtml(opts.autor || '[Autor(es) de la tesis]');
  const fecha = new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
  const escala = escaparHtml(notaEscala || 'Marca con una X la opción que mejor te representa.');

  let cuerpo = '';
  let contador = 0;
  for (const sec of secciones) {
    cuerpo += `<h2>${escaparHtml(sec.nombre)}</h2>\n<table class="items">\n`;
    cuerpo += `<thead><tr><th class="col-n">N°</th><th class="col-item">Ítem</th><th class="col-escala" colspan="5">1&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;3&nbsp;&nbsp;&nbsp;4&nbsp;&nbsp;&nbsp;5</th></tr></thead>\n<tbody>\n`;
    for (const it of sec.items) {
      contador += 1;
      cuerpo += `<tr><td class="col-n">${contador}</td><td class="col-item">${escaparHtml(it.item)}</td>`;
      for (let opcion = 1; opcion <= 5; opcion++) {
        cuerpo += `<td class="casilla">&#9744;</td>`;
      }
      cuerpo += `</tr>\n`;
    }
    cuerpo += `</tbody>\n</table>\n`;
  }

  if (contador === 0) {
    console.error('ADVERTENCIA: no se encontró ningún ítem en el instrumento.md — revisa el formato de las tablas.');
  }

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>${tituloFinal}</title>
<style>
  :root { --primario: #1a3a5c; --texto: #222; --gris: #f2f4f7; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: "Segoe UI", Arial, sans-serif; color: var(--texto); padding: 40px 56px; max-width: 900px; margin: 0 auto; }
  header { text-align: center; border-bottom: 3px solid var(--primario); padding-bottom: 16px; margin-bottom: 24px; }
  header .universidad { font-size: 14px; letter-spacing: 1px; color: #555; text-transform: uppercase; }
  header h1 { font-size: 22px; color: var(--primario); margin-top: 8px; line-height: 1.3; }
  header .carrera { font-size: 14px; color: #555; margin-top: 4px; }
  .consentimiento { background: var(--gris); border-left: 6px solid var(--primario); padding: 14px 18px; font-size: 13px; margin-bottom: 20px; line-height: 1.5; }
  .escala-nota { font-size: 13px; margin-bottom: 20px; font-style: italic; }
  h2 { font-size: 16px; color: var(--primario); margin: 22px 0 10px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
  table.items { border-collapse: collapse; width: 100%; font-size: 13px; margin-bottom: 10px; }
  table.items th, table.items td { border-bottom: 1px solid #ddd; padding: 6px 8px; text-align: left; vertical-align: top; }
  .col-n { width: 30px; text-align: center; }
  .col-item { width: auto; }
  .col-escala { text-align: center; font-size: 11px; color: #555; letter-spacing: 2px; }
  .casilla { text-align: center; font-size: 16px; width: 22px; }
  footer { margin-top: 30px; font-size: 11px; color: #888; text-align: right; }
  @media print {
    body { padding: 20px 30px; }
    @page { margin: 1.5cm; }
  }
</style>
</head>
<body>
<header>
  <div class="universidad">${universidad}</div>
  <h1>${tituloFinal}</h1>
  <div class="carrera">${carrera} — ${autor}</div>
</header>

<div class="consentimiento">
  <strong>Consentimiento informado.</strong> Este cuestionario es parte de un trabajo de investigación académica.
  Tu participación es voluntaria y anónima; la información se usará únicamente con fines académicos.
  Al completarlo, aceptas participar en este estudio.
</div>

<p class="escala-nota">${escala}</p>

${cuerpo}

<footer>Generado el ${fecha} por comun/herramientas/generar_instrumento_html.js — arnés de creación de informes académicos.</footer>
</body>
</html>
`;
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(a.entrada)) {
    console.error(`ERROR: no existe el archivo de entrada: ${a.entrada}`);
    process.exit(1);
  }
  const texto = fs.readFileSync(a.entrada, 'utf8');
  const parsed = parseInstrumento(texto);
  if (parsed.secciones.length === 0) {
    console.error('ERROR: no se encontró ninguna sección "## Variable ..." con una tabla de ítems en el archivo. Revisa el formato de instrumento.md.');
    process.exit(1);
  }
  const html = construirHtml(parsed, a);
  fs.mkdirSync(path.dirname(a.salida), { recursive: true });
  fs.writeFileSync(a.salida, html, 'utf8');
  const totalItems = parsed.secciones.reduce((acc, s) => acc + s.items.length, 0);
  console.log(`Generado: ${a.salida} (${parsed.secciones.length} secciones, ${totalItems} ítems)`);
  console.log('Ábrelo en el navegador e imprime (Ctrl+P -> Guardar como PDF, márgenes por defecto) para aplicar el piloto en papel.');
}

main();
