#!/usr/bin/env node
/**
 * Genera una presentación .pptx REAL y editable a partir de la presentación
 * HTML ya revisada y aprobada (output/entregables/presentacion.html) — no
 * desde output/trabajo/slides.md, para que el .pptx nunca diverja de lo que
 * el alumno ya vio y aprobó visualmente en el navegador.
 *
 * Uso:
 *   node generar_slides_pptx.js output/entregables/presentacion.html --salida output/entregables/presentacion.pptx
 *
 * Parsea cada <section class="slide"> del HTML (título, subtítulo, viñetas,
 * cifra destacada, callout, tabla) y arma un slide equivalente con PptxGenJS,
 * reusando los colores --primario/--acento definidos en el CSS de la
 * plantilla para mantener la misma identidad visual.
 *
 * Usa `pptxgenjs` (requiere haber corrido `npm install` una vez en la raíz
 * del proyecto — ver ../../../AGENTS.md, regla 30). Sin esa instalación,
 * el script se detiene con un mensaje claro en vez de fallar oscuro.
 *
 * El resultado es una aproximación editable, no un calco pixel a pixel del
 * HTML — la revisión visual final en PowerPoint/Impress sigue siendo
 * obligatoria antes de entregar (misma regla que ya regía para el PPTX
 * "opcional avanzado").
 */
'use strict';
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--salida') a.salida = argv[++i];
    else if (!a.entrada) a.entrada = arg;
    else { console.error(`Argumento no reconocido: ${arg}`); process.exit(2); }
  }
  if (!a.entrada) {
    console.error('Uso: node generar_slides_pptx.js <presentacion.html> [--salida <ruta.pptx>]');
    process.exit(2);
  }
  if (!a.salida) {
    a.salida = path.join('output', 'entregables', 'presentacion.pptx');
    console.error(`(sin --salida: se usa el valor por defecto ${a.salida})`);
  }
  return a;
}

function decodificarEntidades(s) {
  return String(s)
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function textoPlano(html) {
  if (!html) return '';
  return decodificarEntidades(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
}

function extraerColores(htmlCompleto) {
  const primario = (htmlCompleto.match(/--primario:\s*(#[0-9a-fA-F]{3,8})/) || [])[1] || '#1a3a5c';
  const acento = (htmlCompleto.match(/--acento:\s*(#[0-9a-fA-F]{3,8})/) || [])[1] || '#c8a24b';
  return { primario: primario.replace('#', ''), acento: acento.replace('#', '') };
}

function extraerTag(html, tag, claseOpcional) {
  const re = claseOpcional
    ? new RegExp(`<${tag}[^>]*class="[^"]*${claseOpcional}[^"]*"[^>]*>([\\s\\S]*?)</${tag}>`, 'i')
    : new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i');
  const m = html.match(re);
  return m ? m[1] : null;
}

// Convierte un <li> en runs {text, bold} — separa un <strong> inicial (ej.
// "<strong>Muestra:</strong> n=120...") del resto, para que el pptx respete
// el énfasis en vez de aplanarlo todo a texto plano.
function itemARuns(liHtml) {
  const m = liHtml.match(/^\s*<strong>([\s\S]*?)<\/strong>\s*(.*)$/i);
  if (m) {
    const negrita = textoPlano(m[1]);
    const resto = textoPlano(m[2]);
    return resto ? [{ text: negrita + ' ', options: { bold: true } }, { text: resto }] : [{ text: negrita, options: { bold: true } }];
  }
  return [{ text: textoPlano(liHtml) }];
}

function extraerViñetas(html) {
  const items = [];
  const reLi = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m;
  while ((m = reLi.exec(html)) !== null) items.push(itemARuns(m[1]));
  return items;
}

function extraerTabla(html) {
  const tablaHtml = extraerTag(html, 'table');
  if (!tablaHtml) return null;
  const filas = [];
  const encabezadoHtml = extraerTag(tablaHtml, 'thead');
  if (encabezadoHtml) {
    const ths = [...encabezadoHtml.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map((m) => textoPlano(m[1]));
    if (ths.length > 0) filas.push(ths.map((t) => ({ text: t, options: { bold: true } })));
  }
  const cuerpoHtml = extraerTag(tablaHtml, 'tbody') || tablaHtml;
  const reFila = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let m;
  while ((m = reFila.exec(cuerpoHtml)) !== null) {
    const tds = [...m[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((c) => textoPlano(c[1]));
    if (tds.length > 0 && tds.some((t) => t.length > 0)) filas.push(tds.map((t) => ({ text: t })));
  }
  return filas.length > 0 ? filas : null;
}

function parseSlide(seccionHtml) {
  const claseMatch = seccionHtml.match(/^<section[^>]*class="([^"]*)"/i);
  const clases = claseMatch ? claseMatch[1] : '';
  return {
    portada: /centrado/.test(clases),
    h1: (() => { const h = extraerTag(seccionHtml, 'h1'); return h ? textoPlano(h) : null; })(),
    h2: (() => { const h = extraerTag(seccionHtml, 'h2'); return h ? textoPlano(h) : null; })(),
    subtitulo: (() => { const h = extraerTag(seccionHtml, 'p', 'subtitulo'); return h ? textoPlano(h) : null; })(),
    destacado: (() => { const h = extraerTag(seccionHtml, 'div', 'destacado'); return h ? textoPlano(h) : null; })(),
    cifra: (() => { const h = extraerTag(seccionHtml, 'p', 'cifra'); return h ? textoPlano(h) : null; })(),
    viñetas: extraerViñetas(seccionHtml),
    tabla: extraerTabla(seccionHtml),
  };
}

function parsePresentacion(html) {
  const secciones = [];
  const re = /<section[^>]*class="[^"]*slide[^"]*"[^>]*>([\s\S]*?)<\/section>/gi;
  let m;
  while ((m = re.exec(html)) !== null) secciones.push(parseSlide(m[0]));
  return secciones;
}

function construirPptx(secciones, colores, PptxGenJS) {
  const pres = new PptxGenJS();
  pres.defineLayout({ name: 'ARNES_16x9', width: 13.333, height: 7.5 });
  pres.layout = 'ARNES_16x9';
  const ANCHO = 13.333;
  const MARGEN = 0.7;

  for (const s of secciones) {
    const slide = pres.addSlide();
    slide.background = { color: 'FFFFFF' };
    // franja inferior, igual que la plantilla HTML
    slide.addShape('rect', { x: 0, y: 7.35, w: ANCHO, h: 0.15, fill: { color: colores.primario } });

    let y = MARGEN;

    if (s.portada) {
      slide.addText(s.h1 || '', { x: MARGEN, y: 2.6, w: ANCHO - 2 * MARGEN, h: 1.5, align: 'center', fontSize: 32, bold: true, color: colores.primario });
      if (s.subtitulo) slide.addText(s.subtitulo, { x: MARGEN, y: 4.2, w: ANCHO - 2 * MARGEN, h: 0.6, align: 'center', fontSize: 16, color: '555555' });
      continue;
    }

    if (s.h2) {
      slide.addText(s.h2, { x: MARGEN, y, w: ANCHO - 2 * MARGEN, h: 0.7, fontSize: 26, bold: true, color: colores.primario });
      y += 0.9;
    }
    if (s.cifra) {
      slide.addText(s.cifra, { x: MARGEN, y, w: ANCHO - 2 * MARGEN, h: 0.9, fontSize: 34, bold: true, color: colores.primario });
      y += 1.0;
    }
    if (s.viñetas.length > 0) {
      // pptxgenjs espera un array plano de {text, options}; unimos cada
      // viñeta como una línea (breakLine) para no perder la separación.
      const flatRuns = [];
      for (const item of s.viñetas) {
        item.forEach((run, idx) => flatRuns.push({ text: run.text, options: { ...(run.options || {}), bullet: idx === 0, breakLine: idx === item.length - 1 } }));
      }
      const altura = Math.min(3.2, 0.4 * s.viñetas.length + 0.3);
      slide.addText(flatRuns, { x: MARGEN, y, w: ANCHO - 2 * MARGEN, h: altura, fontSize: 16, color: '222222', valign: 'top' });
      y += altura + 0.2;
    }
    if (s.tabla) {
      const alturaTabla = Math.min(2.6, 0.4 * s.tabla.length);
      slide.addTable(s.tabla, { x: MARGEN, y, w: ANCHO - 2 * MARGEN, h: alturaTabla, fontSize: 13, border: { type: 'solid', color: 'CCCCCC', pt: 0.5 }, autoPage: false });
      y += alturaTabla + 0.2;
    }
    if (s.destacado) {
      const alturaDestacado = 0.9;
      slide.addShape('rect', { x: MARGEN, y, w: ANCHO - 2 * MARGEN, h: alturaDestacado, fill: { color: 'F2F4F7' }, line: { color: colores.acento, width: 4 } });
      slide.addText(s.destacado, { x: MARGEN + 0.15, y, w: ANCHO - 2 * MARGEN - 0.3, h: alturaDestacado, fontSize: 16, valign: 'middle', color: '222222' });
      y += alturaDestacado + 0.2;
    }
    if (s.subtitulo && !s.portada) {
      slide.addText(s.subtitulo, { x: MARGEN, y, w: ANCHO - 2 * MARGEN, h: 0.5, fontSize: 15, color: '555555' });
    }
  }
  return pres;
}

async function main() {
  const a = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(a.entrada)) {
    console.error(`ERROR: no existe el archivo de entrada: ${a.entrada}`);
    process.exit(1);
  }
  let PptxGenJS;
  try {
    PptxGenJS = require('pptxgenjs');
  } catch (err) {
    console.error('ERROR: no se pudo cargar pptxgenjs. Corre "npm install" una vez en la raíz del proyecto (ver AGENTS.md, regla 30) y vuelve a intentar.');
    process.exit(1);
  }

  const html = fs.readFileSync(a.entrada, 'utf8');
  const colores = extraerColores(html);
  const secciones = parsePresentacion(html);
  if (secciones.length === 0) {
    console.error('ERROR: no se encontró ninguna <section class="slide"> en el archivo. Revisa que sea la presentación HTML generada desde slides-base.html.');
    process.exit(1);
  }

  const pres = construirPptx(secciones, colores, PptxGenJS);
  fs.mkdirSync(path.dirname(a.salida), { recursive: true });
  await pres.writeFile({ fileName: a.salida });
  console.log(`Generado: ${a.salida} (${secciones.length} diapositivas)`);
  console.log('Ábrelo en PowerPoint/Impress y revisa visualmente antes de entregar — el layout es una aproximación editable, no un calco exacto del HTML.');
}

main();
