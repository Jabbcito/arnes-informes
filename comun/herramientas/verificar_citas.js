#!/usr/bin/env node
/**
 * Verificador de citas: cruza las citas del informe contra fuentes y referencias.
 *
 * Comprueba de forma determinista:
 *   1. Toda cita del texto (parentética o narrativa) tiene entrada en la
 *      sección Referencias del informe.
 *   2. Toda referencia listada está citada al menos una vez (sin huérfanas).
 *   3. Todo autor citado corresponde a una fuente con estado VERIFICADA en
 *      fuentes/investigacion.md.
 *   4. Citas textuales (contienen comillas) cerca de la cita sin página
 *      (p. X) → advertencia.
 *
 * Uso:
 *   node verificar_citas.js --informe output/trabajo/informe.md --investigacion fuentes/investigacion.md
 *   node verificar_citas.js --informe output/trabajo/informe.md --investigacion fuentes/investigacion.md --salida output/trabajo/reporte-citas.md
 *
 * Lo que NO puede validar un script (y queda para el alumno):
 *   - que la paráfrasis refleje fielmente la fuente,
 *   - que el año citado sea el correcto para esa afirmación concreta.
 */
'use strict';
const fs = require('fs');

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--informe') a.informe = argv[++i];
    else if (arg === '--investigacion') a.investigacion = argv[++i];
    else if (arg === '--salida') a.salida = argv[++i];
  }
  if (!a.informe) { console.error('Uso: node verificar_citas.js --informe output/trabajo/informe.md [--investigacion ...] [--salida ...]'); process.exit(2); }
  return a;
}

// Apellido con partícula ("de la Cruz", "Del Pozo", "van Dijk") — común en apellidos
// peruanos/españoles. La partícula puede ir en mayúscula (inicio de una entrada de
// Referencias, por regla ortográfica) o minúscula (dentro de una cita en el texto).
// No se soporta apellido compuesto SIN partícula ("Vargas Llosa") a propósito: permitirlo
// sin partícula hace que el patrón "trague" la palabra anterior en frases como
// "Según Hinojo (2019)", produciendo falsos positivos peores que el caso sin soportar.
const CONECTOR = `(?:[Dd]e\\s+la|[Dd]e\\s+los|[Dd]el|[Dd]e|[Vv]an|[Vv]on)`;
const PALABRA = `[A-ZÁÉÍÓÚÑ][\\wÁÉÍÓÚÑáéíóúñ'’-]*`;
const AUTOR_BASE = `(?:${CONECTOR}\\s+${PALABRA}|${PALABRA})`;
const AUTOR_GRUPO = `${AUTOR_BASE}(?:\\s+(?:y|&|et\\s+al\\.?)\\s*(?:${AUTOR_BASE})?)*`;
const YEAR = `(?:19|20)\\d{2}[a-z]?|s\\.f\\.`;
const PAGE = `pp?\\.\\s*\\d+(?:\\s*[-–]\\s*\\d+)?`;

// (Apellido, 2020) | (Apellido y Otro, 2020) | (Apellido et al., 2020) | (OMS, 2020, p. 3) | (de la Cruz, 2019)
const PARENTETICA = new RegExp(`\\((${AUTOR_GRUPO})\\s*,\\s*(${YEAR})(?:\\s*,\\s*(${PAGE}))?\\)`, 'g');
// Apellido (2020) | Apellido et al. (2020) | Apellido y Otro (2020) | de la Cruz (2019)
const NARRATIVA = new RegExp(`\\b(${AUTOR_BASE}(?:\\s+(?:y|&)\\s+${AUTOR_BASE})?(?:\\s+et\\s+al\\.?)?)\\s*\\(\\s*(${YEAR})\\s*(?:,\\s*(${PAGE}))?\\)`, 'g');
const COMILLAS = /["“”«»]/;
const AUTOR_BASE_RX = new RegExp(`^(${AUTOR_BASE})`);
const AUTOR_ANIO_RX = new RegExp(`\\b(${AUTOR_BASE})\\s*(?:,|\\()\\s*(?:19|20)\\d{2}`, 'g');

function normalizar(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function primerApellido(autores) {
  const a = autores.trim().split(/\s+(?:y|&|et)\s/)[0];
  return normalizar(a.trim().replace(/,$/, ''));
}

function extraerCitas(texto, inicioRefs) {
  const lineas = texto.split('\n');
  const citas = [];
  const limite = inicioRefs || lineas.length + 1;
  for (let num = 1; num <= lineas.length; num++) {
    if (num >= limite) break;
    const linea = lineas[num - 1];
    for (const rx of [PARENTETICA, NARRATIVA]) {
      rx.lastIndex = 0;
      let m;
      while ((m = rx.exec(linea)) !== null) {
        citas.push({
          apellido: primerApellido(m[1]),
          cruda: `${m[1]}, ${m[2]}`,
          anio: m[2],
          pagina: m[3],
          linea: num,
          textual: COMILLAS.test(linea),
        });
      }
    }
  }
  return citas;
}

function localizarReferencias(texto) {
  const lineas = texto.split('\n');
  let inicio = 0;
  const rxTitulo = /^#*\s*\**\s*Referencias(\s+bibliográficas)?\s*\**\s*$/i;
  for (let i = 0; i < lineas.length; i++) {
    if (rxTitulo.test(lineas[i].trim())) { inicio = i + 1; break; }
  }
  const entradas = [];
  if (inicio) {
    for (let j = inicio; j < lineas.length; j++) {
      const l = lineas[j].trim();
      if (/^#|^\**\s*Anexos/i.test(l)) break;
      if (l && /^[A-ZÁÉÍÓÚÑ]/.test(l)) {
        const m = l.match(AUTOR_BASE_RX);
        const anio = l.match(/\(((?:19|20)\d{2}[a-z]?|s\.f\.)\)/);
        if (m) {
          entradas.push({
            apellido: normalizar(m[1]),
            anio: anio ? anio[1] : null,
            linea: j + 1,
            texto: l.slice(0, 90),
          });
        }
      }
    }
  }
  return { inicio, entradas };
}

function fuentesVerificadas(ruta) {
  if (!ruta || !fs.existsSync(ruta)) return null;
  const txt = fs.readFileSync(ruta, 'utf8');
  const verificadas = new Set();
  const pendientes = new Set();
  const bloques = txt.split(/\n\s*\n/);
  for (const bloque of bloques) {
    const apellidos = new Set();
    let m;
    AUTOR_ANIO_RX.lastIndex = 0;
    while ((m = AUTOR_ANIO_RX.exec(bloque)) !== null) apellidos.add(normalizar(m[1]));
    if (/\bVERIFICADA\b/.test(bloque)) {
      apellidos.forEach((a) => verificadas.add(a));
    } else if (/PENDIENTE DE VERIFICAR/i.test(bloque)) {
      apellidos.forEach((a) => pendientes.add(a));
    }
  }
  return { verificadas, pendientes };
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  const texto = fs.readFileSync(a.informe, 'utf8');
  const { inicio: inicioRefs, entradas: refs } = localizarReferencias(texto);
  const citas = extraerCitas(texto, inicioRefs);
  const inv = a.investigacion ? fuentesVerificadas(a.investigacion) : null;

  const problemas = [];
  const avisos = [];

  if (!inicioRefs) problemas.push("No se encontró la sección 'Referencias' en el informe.");

  const apellidosRef = new Set(refs.map((r) => r.apellido));
  const apellidosCitados = new Set(citas.map((c) => c.apellido));

  for (const c of citas) {
    if (inicioRefs && !apellidosRef.has(c.apellido)) {
      problemas.push(`L${c.linea}: cita '(${c.cruda})' SIN entrada en Referencias.`);
    }
    if (c.textual && !c.pagina) {
      avisos.push(`L${c.linea}: posible cita textual sin página: '(${c.cruda})'.`);
    }
    if (inv) {
      if (inv.pendientes.has(c.apellido) && !inv.verificadas.has(c.apellido)) {
        problemas.push(`L${c.linea}: '${c.cruda}' citada pero su fuente sigue PENDIENTE DE VERIFICAR.`);
      } else if (!inv.verificadas.has(c.apellido) && !inv.pendientes.has(c.apellido)) {
        avisos.push(`L${c.linea}: '${c.cruda}' no aparece registrada en investigacion.md.`);
      }
    }
  }

  for (const r of refs) {
    if (!apellidosCitados.has(r.apellido)) {
      problemas.push(`L${r.linea}: referencia HUÉRFANA (nunca citada): ${r.texto}...`);
    }
  }

  const out = [
    '# Reporte de verificación de citas', '',
    `- Citas detectadas en el cuerpo: ${citas.length}`,
    `- Entradas en Referencias: ${refs.length}`,
    `- Problemas: ${problemas.length} | Avisos: ${avisos.length}`, '',
  ];
  if (problemas.length) out.push('## PROBLEMAS (corregir antes de exportar)', '', ...problemas.map((p) => `- ${p}`), '');
  if (avisos.length) out.push('## Avisos (revisar)', '', ...avisos.map((v) => `- ${v}`), '');
  if (!problemas.length && !avisos.length) out.push('Sin problemas detectados por el script.', '');
  out.push(
    '## Fuera del alcance del script (revisión humana)', '',
    '- ¿Cada paráfrasis refleja fielmente lo que dice la fuente?',
    '- ¿El año citado corresponde a esa afirmación concreta?',
    '- Formato fino APA de cada entrada (cursivas, DOI): ver comun/apa/referencias.md.'
  );

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
