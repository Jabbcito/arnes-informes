#!/usr/bin/env node
/**
 * Verificador estructural del informe/tesis (determinista).
 *
 * Comprueba:
 *   1. Numeración de tablas y figuras: correlativa, sin saltos ni duplicados.
 *   2. Toda "Tabla N"/"Figura N"/"Anexo N" mencionada en el texto existe
 *      (tiene su definición **Tabla N** / **Figura N** / encabezado de anexo).
 *   3. Marcadores pendientes: [EVIDENCIA PENDIENTE] y [PENDIENTE: ...], con línea.
 *   4. Secciones esperadas presentes (lista configurable con --secciones).
 *
 * Uso:
 *   node verificar_estructura.js --informe output/trabajo/informe.md
 *   node verificar_estructura.js --informe output/trabajo/informe.md --salida output/trabajo/reporte-estructura.md
 */
'use strict';
const fs = require('fs');

const SECCIONES_TESIS = ['Resumen', 'Abstract', 'Introducción', 'Marco teórico',
  'Metodología', 'Resultados', 'Discusión', 'Conclusiones',
  'Recomendaciones', 'Referencias'];

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--informe') a.informe = argv[++i];
    else if (arg === '--secciones') a.secciones = argv[++i];
    else if (arg === '--salida') a.salida = argv[++i];
  }
  if (!a.informe) { console.error('Uso: node verificar_estructura.js --informe output/trabajo/informe.md [--secciones a,b,c] [--salida ...]'); process.exit(2); }
  return a;
}

function numerosDefinidos(texto, rx) {
  const out = [];
  let m;
  rx.lastIndex = 0;
  while ((m = rx.exec(texto)) !== null) {
    const grupo = m.slice(1).find((g) => g !== undefined);
    out.push(Number(grupo));
  }
  return out;
}

function chequearNumeracion(nums, etiqueta, problemas) {
  const vistos = new Set();
  for (const n of nums) {
    if (vistos.has(n)) problemas.push(`${etiqueta} ${n} está definida más de una vez.`);
    vistos.add(n);
  }
  if (vistos.size) {
    const maxN = Math.max(...vistos);
    const faltan = [];
    for (let i = 1; i <= maxN; i++) if (!vistos.has(i)) faltan.push(i);
    if (faltan.length) problemas.push(`${etiqueta}s con numeración salteada: faltan [${faltan.join(', ')}] (máx definida: ${maxN}).`);
    const ordenado = [...nums].sort((a, b) => a - b);
    if (JSON.stringify(nums) !== JSON.stringify(ordenado)) {
      problemas.push(`${etiqueta}s definidas fuera de orden de numeración: [${nums.join(', ')}].`);
    }
  }
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  const texto = fs.readFileSync(a.informe, 'utf8');
  const lineas = texto.split('\n');
  const problemas = [];
  const avisos = [];

  // Reconoce dos sintaxis: la vieja ("**Tabla N**" en línea propia, compatibilidad
  // hacia atrás) y la nueva (caption nativo de Pandoc, ver comun/apa/tablas-figuras-apa.md).
  const DEF_TABLA = /^\**\s*Tabla\s+(\d+)\s*\**\s*$|^Table:\s*\**\s*Tabla\s+(\d+)\./gim;
  const DEF_FIGURA = /^\**\s*Figura\s+(\d+)\s*\**\s*$|!\[\s*\**\s*Figura\s+(\d+)\./gim;
  const DEF_ANEXO = /^#*\s*\**\s*Anexo\s+(?:N\.?°?\s*)?(\d+)/gim;
  const MENCION = /\b(Tabla|Figura|Anexo)\s+(?:N\.?°?\s*)?(\d+)\b/gi;
  const PENDIENTE = /\[(EVIDENCIA PENDIENTE|PENDIENTE:[^\]]*)\]/g;

  const tablas = numerosDefinidos(texto, DEF_TABLA);
  const figuras = numerosDefinidos(texto, DEF_FIGURA);
  const anexos = numerosDefinidos(texto, DEF_ANEXO);
  chequearNumeracion(tablas, 'Tabla', problemas);
  chequearNumeracion(figuras, 'Figura', problemas);

  const defT = new Set(tablas), defF = new Set(figuras), defA = new Set(anexos);
  const existePorTipo = { Tabla: defT, Figura: defF, Anexo: defA };

  lineas.forEach((linea, idx) => {
    const num = idx + 1;
    MENCION.lastIndex = 0;
    let m;
    while ((m = MENCION.exec(linea)) !== null) {
      const tipo = m[1][0].toUpperCase() + m[1].slice(1).toLowerCase();
      const n = Number(m[2]);
      const existe = existePorTipo[tipo];
      if (existe && !existe.has(n)) {
        const rxDef = new RegExp(`^\\**\\s*${tipo}\\s+(?:N\\.?°?\\s*)?${n}\\b`, 'i');
        if (!rxDef.test(linea.trim())) {
          problemas.push(`L${num}: se menciona ${tipo} ${n} pero no está definida en el documento.`);
        }
      }
    }
  });

  lineas.forEach((linea, idx) => {
    PENDIENTE.lastIndex = 0;
    let m;
    while ((m = PENDIENTE.exec(linea)) !== null) {
      avisos.push(`L${idx + 1}: marcador [${m[1]}]`);
    }
  });

  const secciones = a.secciones ? a.secciones.split(',').map((s) => s.trim()) : SECCIONES_TESIS;
  for (const s of secciones) {
    const esc = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rx = new RegExp(`^(#+\\s*.*${esc}|\\s*[IVX0-9.\\s]*${esc.toUpperCase()})\\s*$`, 'im');
    if (!rx.test(texto)) problemas.push(`Sección esperada no encontrada: '${s}'.`);
  }

  const out = [
    '# Reporte de verificación estructural', '',
    `- Tablas definidas: ${tablas.length} | Figuras: ${figuras.length} | Anexos: ${anexos.length}`,
    `- Problemas: ${problemas.length} | Pendientes/avisos: ${avisos.length}`, '',
  ];
  if (problemas.length) out.push('## PROBLEMAS', '', ...problemas.map((p) => `- ${p}`), '');
  if (avisos.length) out.push('## Pendientes y avisos', '', ...avisos.map((v) => `- ${v}`), '');
  if (!problemas.length && !avisos.length) out.push('Sin problemas detectados por el script.', '');

  const reporte = out.join('\n');
  if (a.salida) {
    fs.writeFileSync(a.salida, reporte, 'utf8');
    console.log(`Reporte escrito en ${a.salida}`);
  } else {
    console.log(reporte);
  }
  process.exit(problemas.length ? 1 : 0);
}

main();
