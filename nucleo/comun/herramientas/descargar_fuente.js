#!/usr/bin/env node
/**
 * Descarga una fuente (PDF o HTML) a disco. Si es PDF, además extrae el
 * texto real con pdf-parse a un .txt hermano — así la lectura completa
 * NUNCA depende de si la herramienta de IA del alumno (OpenCode/Claude
 * Code/Codex) sabe abrir PDF de forma nativa o no; siempre hay un .txt
 * plano garantizado para leer.
 *
 * Uso:
 *   node descargar_fuente.js <url> --salida fuentes/pdfs/nombre.pdf
 *   node descargar_fuente.js <url> --salida fuentes/pdfs/nombre    # sin extensión: se detecta sola
 *
 * Sigue hasta 3 redirecciones. Detecta la extensión por el header
 * Content-Type (application/pdf -> .pdf, text/html -> .html); si no hay
 * header útil, usa la extensión de la URL o guarda como .html por defecto.
 * La descarga en sí no tiene dependencias externas (solo https/http nativos
 * de Node); la extracción de texto de PDF usa `pdf-parse` (requiere haber
 * corrido `npm install` una vez en la raíz del proyecto — ver
 * `../../../AGENTS.md`, regla 30).
 *
 * Si el sitio bloquea el acceso automatizado (403/anti-bot) o la URL no
 * responde, termina con código de salida 1 y un mensaje claro — nunca
 * inventa contenido ni deja el archivo a medio escribir.
 */
'use strict';
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const a = { maxRedirects: 3 };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--salida') a.salida = argv[++i];
    else if (!a.url) a.url = arg;
    else { console.error(`Argumento no reconocido: ${arg}`); process.exit(2); }
  }
  if (!a.url || !a.salida) {
    console.error('Uso: node descargar_fuente.js <url> --salida <ruta-destino>');
    process.exit(2);
  }
  return a;
}

function extensionPorContentType(contentType) {
  if (!contentType) return null;
  if (contentType.includes('application/pdf')) return '.pdf';
  if (contentType.includes('text/html')) return '.html';
  if (contentType.includes('application/xhtml+xml')) return '.html';
  return null;
}

function descargar(url, redirectsRestantes) {
  return new Promise((resolve, reject) => {
    const cliente = url.startsWith('https:') ? https : http;
    const req = cliente.get(
      url,
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; arnes-informes-bot/1.0)' }, timeout: 20000 },
      (res) => {
        const { statusCode, headers } = res;
        if ([301, 302, 303, 307, 308].includes(statusCode) && headers.location) {
          res.resume();
          if (redirectsRestantes <= 0) {
            reject(new Error(`Demasiadas redirecciones, se detuvo en: ${url}`));
            return;
          }
          const siguiente = new URL(headers.location, url).toString();
          resolve(descargar(siguiente, redirectsRestantes - 1));
          return;
        }
        if (statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${statusCode} al descargar ${url} (posible bloqueo anti-bot o URL inválida)`));
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType: headers['content-type'] }));
        res.on('error', reject);
      }
    );
    req.on('timeout', () => { req.destroy(new Error(`Tiempo de espera agotado al descargar ${url}`)); });
    req.on('error', reject);
  });
}

async function main() {
  const a = parseArgs(process.argv.slice(2));
  let resultado;
  try {
    resultado = await descargar(a.url, a.maxRedirects);
  } catch (err) {
    console.error(`ERROR: no se pudo descargar la fuente.\n  URL: ${a.url}\n  Motivo: ${err.message}`);
    console.error('  No se guardó ningún archivo. Registra este intento fallido en fuentes/investigacion.md en vez de completar los datos con un resumen sin verificar.');
    process.exit(1);
  }

  let destino = a.salida;
  if (!path.extname(destino)) {
    const ext = extensionPorContentType(resultado.contentType) || '.html';
    destino += ext;
  }
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, resultado.buffer);
  console.log(`Guardado: ${destino} (${resultado.buffer.length} bytes, Content-Type: ${resultado.contentType || 'desconocido'})`);

  if (path.extname(destino).toLowerCase() === '.pdf') {
    await extraerTextoPdf(destino, resultado.buffer);
  } else {
    console.log('Siguiente paso: lee este archivo local completo con tu herramienta de lectura de archivos para extraer los datos reales (no te quedes con el resumen del buscador).');
  }
}

async function extraerTextoPdf(rutaPdf, buffer) {
  const rutaTxt = rutaPdf + '.txt';
  let PDFParse;
  try {
    ({ PDFParse } = require('pdf-parse'));
  } catch (err) {
    console.error('ADVERTENCIA: no se pudo cargar pdf-parse (¿falta "npm install" en la raíz del proyecto? ver AGENTS.md regla 30).');
    console.error('El PDF se guardó igual, pero sin extracción automática de texto — ábrelo con tu herramienta de lectura de archivos como respaldo.');
    return;
  }
  let parser;
  try {
    parser = new PDFParse({ data: buffer });
    const resultado = await parser.getText();
    const texto = (resultado.text || '').trim();
    if (texto.length < 50) {
      console.error(`ADVERTENCIA: pdf-parse no encontró texto extraíble en ${rutaPdf} (probablemente un PDF escaneado / solo imágenes).`);
      console.error('No se generó .txt. Abre el PDF original con tu herramienta de lectura como respaldo, o pide al alumno una versión con texto real (no una imagen escaneada).');
      return;
    }
    fs.writeFileSync(rutaTxt, texto, 'utf8');
    console.log(`Texto extraído: ${rutaTxt} (${texto.length} caracteres)`);
    console.log(`Siguiente paso: lee ${rutaTxt} completo con tu herramienta de lectura de archivos para extraer los datos reales (no te quedes con el resumen del buscador). Esta extracción es determinista — no depende de si tu IA puede abrir PDF nativamente.`);
  } catch (err) {
    console.error(`ADVERTENCIA: pdf-parse falló al procesar ${rutaPdf}: ${err.message}`);
    console.error('El PDF se guardó igual. Ábrelo con tu herramienta de lectura de archivos como respaldo.');
  } finally {
    if (parser) await parser.destroy();
  }
}

main();
