#!/usr/bin/env node
/**
 * Confirma que un DOI existe de verdad y muestra sus metadatos reales
 * (título, autores, año, revista), consultando la API pública de CrossRef
 * (https://crossref.org, gratis, sin clave). Es un CHEQUEO DE REFUERZO
 * automático — no reemplaza la lectura completa de la fuente ni la
 * verificación humana: úsalo para comparar contra lo que ya registraste en
 * fuentes/investigacion.md antes de marcarla VERIFICADA.
 *
 * Uso:
 *   node verificar_doi.js 10.1234/ejemplo.2020.001
 *   node verificar_doi.js 10.1234/ejemplo.2020.001 --salida output/trabajo/doi-check.md
 *
 * Sin dependencias externas (solo https nativo de Node).
 */
'use strict';
const https = require('https');
const { imprimirYGuardar } = require('./lib-salida');

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--salida') a.salida = argv[++i];
    else if (arg === '--contacto') a.contacto = argv[++i];
    else if (!a.doi) a.doi = arg;
    else { console.error(`Argumento no reconocido: ${arg}`); process.exit(2); }
  }
  if (!a.doi) {
    console.error('Uso: node verificar_doi.js <DOI> [--salida ruta.md]');
    process.exit(2);
  }
  a.doi = a.doi.replace(/^https?:\/\/doi\.org\//i, '');
  return a;
}

function consultar(doi, contacto) {
  return new Promise((resolve, reject) => {
    const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}?mailto=${encodeURIComponent(contacto || 'arnes-informes@example.org')}`;
    const req = https.get(url, { headers: { 'User-Agent': 'arnes-informes-bot/1.0' }, timeout: 15000 }, (res) => {
      if (res.statusCode === 404) {
        res.resume();
        reject(new Error('DOI no encontrado en CrossRef (404) — puede no existir, tener una errata, o estar registrado en otra agencia de DOI (ej. DataCite) que CrossRef no indexa.'));
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`CrossRef respondió HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
        } catch (err) {
          reject(new Error(`Respuesta de CrossRef no es JSON válido: ${err.message}`));
        }
      });
      res.on('error', reject);
    });
    req.on('timeout', () => req.destroy(new Error('Tiempo de espera agotado consultando CrossRef')));
    req.on('error', reject);
  });
}

function nombresAutores(authors) {
  if (!authors || authors.length === 0) return '(autor no disponible)';
  return authors.map((a) => [a.given, a.family].filter(Boolean).join(' ') || a.name).filter(Boolean).join('; ');
}

async function main() {
  const a = parseArgs(process.argv.slice(2));
  let datos;
  try {
    datos = await consultar(a.doi, a.contacto);
  } catch (err) {
    console.error(`ERROR: no se pudo verificar el DOI "${a.doi}".\n  Motivo: ${err.message}`);
    console.error('  No trates este DOI como confirmado. Revisa que esté bien escrito, o verifica manualmente en https://doi.org/' + a.doi);
    process.exit(1);
  }

  const w = datos.message || {};
  const titulo = (w.title && w.title[0]) || '(sin título)';
  const anio = (w.published && w.published['date-parts'] && w.published['date-parts'][0] && w.published['date-parts'][0][0])
    || (w.issued && w.issued['date-parts'] && w.issued['date-parts'][0] && w.issued['date-parts'][0][0])
    || '(sin año)';
  const autores = nombresAutores(w.author);
  const revista = (w['container-title'] && w['container-title'][0]) || '(revista no disponible)';
  const tipo = w.type || '(tipo no disponible)';

  const lineas = [
    `DOI verificado en CrossRef: ${a.doi}`,
    '',
    `Título real: ${titulo}`,
    `Autores reales: ${autores}`,
    `Año real: ${anio}`,
    `Revista/fuente real: ${revista}`,
    `Tipo de documento: ${tipo}`,
    `URL: https://doi.org/${a.doi}`,
    '',
    'Compara estos datos contra lo registrado en fuentes/investigacion.md para esta fuente.',
    'Este chequeo confirma que el DOI existe y trae sus metadatos reales — no reemplaza leer la fuente completa antes de marcarla VERIFICADA.',
  ];
  imprimirYGuardar(lineas, a.salida);
}

main();
