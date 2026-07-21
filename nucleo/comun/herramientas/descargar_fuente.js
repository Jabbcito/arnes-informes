#!/usr/bin/env node
/**
 * Descarga una fuente (PDF o HTML) a disco para que el agente la lea completa
 * con su propia herramienta de lectura de archivos, en vez de citar solo el
 * resumen que devuelve un buscador.
 *
 * Uso:
 *   node descargar_fuente.js <url> --salida fuentes/pdfs/nombre.pdf
 *   node descargar_fuente.js <url> --salida fuentes/pdfs/nombre    # sin extensión: se detecta sola
 *
 * Sigue hasta 3 redirecciones. Detecta la extensión por el header
 * Content-Type (application/pdf -> .pdf, text/html -> .html); si no hay
 * header útil, usa la extensión de la URL o guarda como .html por defecto.
 * Sin dependencias externas (solo https/http nativos de Node).
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
  console.log('Siguiente paso: lee este archivo local completo con tu herramienta de lectura de archivos para extraer los datos reales (no te quedes con el resumen del buscador).');
}

main();
