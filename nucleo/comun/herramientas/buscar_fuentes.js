#!/usr/bin/env node
/**
 * Busca fuentes académicas reales en OpenAlex (https://openalex.org),
 * un catálogo abierto de 250M+ trabajos, gratis y sin necesidad de clave.
 * Devuelve metadatos estructurados (autor, año, DOI, revista, enlace a PDF
 * de acceso abierto si existe) — para elegir candidatas reales ANTES de
 * intentar descargarlas, en vez de raspar una página de resultados de
 * buscador (que a veces devuelve páginas anti-bot con HTTP 200 pero sin
 * contenido real, como ocurrió en una prueba real de este arnés).
 *
 * Uso:
 *   node buscar_fuentes.js "procrastinacion academica universitarios"
 *   node buscar_fuentes.js "..." --desde 2020            # año de publicación >= 2020
 *   node buscar_fuentes.js "..." --limite 10              # por defecto 10, máx 25
 *   node buscar_fuentes.js "..." --solo-acceso-abierto     # solo resultados con PDF descargable
 *   node buscar_fuentes.js "..." --salida output/trabajo/busqueda-openalex.md
 *
 * Sin dependencias externas (solo https nativo de Node, igual que
 * descargar_fuente.js). Esto NO reemplaza la verificación humana: cada
 * resultado sigue debiendo descargarse (descargar_fuente.js) y leerse
 * completo antes de registrarse como VERIFICADA en fuentes/investigacion.md.
 */
'use strict';
const https = require('https');
const { imprimirYGuardar } = require('./lib-salida');

function parseArgs(argv) {
  const a = { limite: 10, soloAccesoAbierto: false };
  const resto = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--desde') a.desde = Number(argv[++i]);
    else if (arg === '--limite') a.limite = Math.min(25, Number(argv[++i]));
    else if (arg === '--solo-acceso-abierto') a.soloAccesoAbierto = true;
    else if (arg === '--salida') a.salida = argv[++i];
    else if (arg === '--contacto') a.contacto = argv[++i];
    else resto.push(arg);
  }
  a.termino = resto.join(' ').trim();
  if (!a.termino) {
    console.error('Uso: node buscar_fuentes.js "término de búsqueda" [--desde 2020] [--limite 10] [--solo-acceso-abierto] [--salida ruta.md]');
    process.exit(2);
  }
  return a;
}

function construirUrl(a) {
  const filtros = [];
  if (a.desde) filtros.push(`publication_year:>${a.desde - 1}`);
  if (a.soloAccesoAbierto) filtros.push('is_oa:true');
  const params = new URLSearchParams();
  params.set('search', a.termino);
  if (filtros.length > 0) params.set('filter', filtros.join(','));
  params.set('per_page', String(a.limite));
  params.set('sort', 'relevance_score:desc');
  // El parámetro mailto activa el "polite pool" de OpenAlex (respuestas más
  // rápidas y confiables) — no requiere registro, es solo buena práctica.
  params.set('mailto', a.contacto || 'arnes-informes@example.org');
  return `https://api.openalex.org/works?${params.toString()}`;
}

function consultar(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'arnes-informes-bot/1.0' }, timeout: 15000 }, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`OpenAlex respondió HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
        } catch (err) {
          reject(new Error(`Respuesta de OpenAlex no es JSON válido: ${err.message}`));
        }
      });
      res.on('error', reject);
    });
    req.on('timeout', () => req.destroy(new Error('Tiempo de espera agotado consultando OpenAlex')));
    req.on('error', reject);
  });
}

function nombresAutores(work) {
  const autorships = work.authorships || [];
  return autorships.map((a) => a.author && a.author.display_name).filter(Boolean).join('; ') || '(autor no disponible)';
}

function formatearResultado(work, i) {
  const titulo = work.title || work.display_name || '(sin título)';
  const anio = work.publication_year || '(sin año)';
  const autores = nombresAutores(work);
  const revista = (work.primary_location && work.primary_location.source && work.primary_location.source.display_name) || '(revista no disponible)';
  const doi = work.doi ? work.doi.replace('https://doi.org/', '') : null;
  const oa = work.open_access || {};
  const pdfUrl = (work.best_oa_location && work.best_oa_location.pdf_url) || null;
  const landingUrl = (work.best_oa_location && work.best_oa_location.landing_page_url) || work.id;

  const lineas = [
    `${i}. ${titulo} (${anio})`,
    `   Autores: ${autores}`,
    `   Revista/fuente: ${revista}`,
    `   Acceso abierto: ${oa.is_oa ? 'sí' : 'no'}${oa.is_oa && oa.oa_status ? ` (${oa.oa_status})` : ''}`,
  ];
  if (doi) lineas.push(`   DOI: ${doi}  (verificar con: node verificar_doi.js ${doi})`);
  if (pdfUrl) lineas.push(`   PDF directo: ${pdfUrl}  (descargar con: node descargar_fuente.js "${pdfUrl}" --salida fuentes/pdfs/nombre)`);
  else lineas.push(`   PDF directo: no disponible — visita ${landingUrl} para buscar el acceso`);
  return lineas.join('\n');
}

async function main() {
  const a = parseArgs(process.argv.slice(2));
  let datos;
  try {
    datos = await consultar(construirUrl(a));
  } catch (err) {
    console.error(`ERROR: no se pudo consultar OpenAlex.\n  Motivo: ${err.message}`);
    console.error('  No se inventó ningún resultado. Reintenta, o busca manualmente en las bases de fuentes-permitidas.md.');
    process.exit(1);
  }

  const resultados = datos.results || [];
  const lineas = [
    `Búsqueda OpenAlex: "${a.termino}"${a.desde ? ` (desde ${a.desde})` : ''}${a.soloAccesoAbierto ? ' (solo acceso abierto)' : ''}`,
    `Resultados totales encontrados: ${datos.meta ? datos.meta.count : '?'} | Mostrando: ${resultados.length}`,
    '',
  ];
  if (resultados.length === 0) {
    lineas.push('Sin resultados. Prueba otros términos, quita --solo-acceso-abierto, o amplía --desde a un año anterior.');
  } else {
    resultados.forEach((w, idx) => lineas.push(formatearResultado(w, idx + 1) + '\n'));
    lineas.push('Recordatorio: esto es un punto de partida, no una fuente verificada. Cada resultado elegido debe descargarse y leerse completo (descargar_fuente.js) antes de registrarse como VERIFICADA en fuentes/investigacion.md.');
  }
  imprimirYGuardar(lineas, a.salida);
}

main();
