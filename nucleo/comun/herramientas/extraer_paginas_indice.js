#!/usr/bin/env node
/**
 * extraer_paginas_indice.js — localiza la página real de cada título de
 * informe.md dentro del PDF ya maquetado (LibreOffice) y escribe
 * output/trabajo/indice-paginas.json, que el filtro indice-toc.lua usa para
 * poblar el índice de contenidos con entradas y números de página reales.
 *
 * Por qué existe: Pandoc no maqueta páginas, así que los números de página
 * del índice solo pueden salir de una maquetación real (el PDF). El índice
 * debe generarse al final del flujo, cuando el documento está completo
 * (ver exportar-word.md — "Índice de contenidos real").
 *
 * Uso: node extraer_paginas_indice.js --informe output/trabajo/informe.md \
 *        --pdf output/entregables/informe.pdf \
 *        --salida output/trabajo/indice-paginas.json
 *
 * Salida: JSON [{titulo, nivel, pagina}] en orden de aparición en el Markdown.
 * Exit 1 si algún título no se localiza en el PDF (no se escribe el JSON).
 *
 * Dependencia: pdf-parse (regla 30 — requiere `npm install` una vez en la raíz).
 */

const fs = require('fs');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq > 0) {
        args[a.slice(2, eq)] = a.slice(eq + 1);
      } else {
        args[a.slice(2)] = argv[++i] || '';
      }
    }
  }
  return args;
}

function extraerTitulos(md) {
  const lineas = md.split(/\r?\n/);
  const titulos = [];
  let enCodigo = false;
  for (const linea of lineas) {
    if (/^```/.test(linea)) { enCodigo = !enCodigo; continue; }
    if (enCodigo) continue;
    const m = linea.match(/^(#{1,3})\s+(.+)$/);
    if (!m) continue;
    const nivel = m[1].length;
    if (nivel < 2) continue; // el título del documento (nivel 1) no va al índice
    const texto = m[2].replace(/\*\*|\*|`/g, '').replace(/\s+/g, ' ').trim();
    if (!texto) continue;
    titulos.push({ texto, nivel });
  }
  return titulos;
}

function normalizar(texto) {
  return texto.split(/\r?\n/).map((l) => l.replace(/\s+/g, ' ').trim()).join('\n');
}

function escaparRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.informe || !args.pdf || !args.salida) {
    console.error('Uso: node extraer_paginas_indice.js --informe <md> --pdf <pdf> --salida <json>');
    process.exit(1);
  }

  const md = fs.readFileSync(args.informe, 'utf8');
  const titulos = extraerTitulos(md);
  if (!titulos.length) {
    console.error('No se encontraron títulos de nivel 2-3 en ' + args.informe);
    process.exit(1);
  }

  let PDFParse;
  try {
    ({ PDFParse } = require('pdf-parse'));
  } catch (e) {
    console.error('ADVERTENCIA: no se pudo cargar pdf-parse (¿falta "npm install" en la raíz? ver AGENTS.md regla 30). ' + e.message);
    process.exit(1);
  }

  const pdf = new PDFParse({ data: fs.readFileSync(args.pdf) });
  const doc = await pdf.getText();
  const paginas = doc.pages || [];
  console.log('PDF leído: ' + (doc.total || paginas.length) + ' páginas; ' + titulos.length + ' títulos a localizar.');

  // Las páginas del índice NO se usan para localizar títulos: sus líneas
  // contienen los mismos textos (una entrada del índice puede quedar partida
  // y el título completo aparece como línea propia, generando falsos
  // positivos). Rango a excluir: desde la página del título "ÍNDICE DE
  // CONTENIDOS" hasta la página del encabezado "RESUMEN" (sin incluirla).
  const esLinea = (texto, patron) => new RegExp('^' + patron + '$', 'm').test(normalizar(texto));
  const paginaIndice = paginas.find((p) => esLinea(p.text, 'ÍNDICE DE CONTENIDOS'))?.num;
  let paginaResumen = null;
  if (paginaIndice !== undefined) {
    for (const p of paginas) {
      if (p.num < paginaIndice) continue;
      if (esLinea(p.text, 'RESUMEN')) { paginaResumen = p.num; break; }
    }
  }
  const excluir = (num) => paginaIndice !== undefined && num >= paginaIndice && num < (paginaResumen ?? Infinity);
  if (paginaIndice !== undefined) {
    console.log('Índice en páginas ' + paginaIndice + (paginaResumen ? ' a ' + (paginaResumen - 1) : '') + ' — excluidas de la búsqueda.');
  }

  const noEncontrados = [];
  const resultados = [];
  for (const t of titulos) {
    // El título debe empezar al inicio de una línea y terminar al final de la
    // misma (excluye menciones inline); las palabras se unen con \s+ porque
    // un título largo puede partirse en dos líneas dentro del PDF maquetado.
    const palabras = t.texto.split(/\s+/).map(escaparRegex);
    const re = new RegExp('^\\s*' + palabras.join('\\s+') + '(?=\\s*$)', 'm');
    let pagina = null;
    for (const p of paginas) {
      if (excluir(p.num)) continue;
      if (re.test(normalizar(p.text))) { pagina = p.num; break; }
    }
    if (pagina === null) { noEncontrados.push(t.texto); continue; }
    resultados.push({ titulo: t.texto, nivel: t.nivel, pagina });
  }

  if (noEncontrados.length) {
    console.error('Títulos NO localizados como línea propia en el PDF (revisar informe o maquetación):');
    for (const n of noEncontrados) console.error('  - ' + n);
    process.exit(1);
  }

  fs.writeFileSync(args.salida, JSON.stringify(resultados, null, 2));
  console.log('Índice extraído: ' + resultados.length + ' entradas → ' + args.salida);
}

main().catch((e) => { console.error(e); process.exit(1); });
