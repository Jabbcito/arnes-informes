/**
 * Parser CSV mínimo, sin dependencias externas.
 * Soporta comillas dobles y comas dentro de campos entrecomillados.
 * No soporta saltos de línea dentro de un campo (uso académico simple: CSV plano).
 */
'use strict';
const fs = require('fs');

function parseLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = false;
      } else cur += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { out.push(cur); cur = ''; }
      else cur += c;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function readCsv(ruta) {
  let raw = fs.readFileSync(ruta, 'utf8');
  if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1); // BOM
  const lineas = raw.split(/\r\n|\n|\r/).filter((l) => l.trim().length > 0);
  return lineas.map(parseLine);
}

function readCsvObjects(ruta) {
  const filas = readCsv(ruta);
  const encabezado = filas[0];
  return filas.slice(1).map((fila) => {
    const obj = {};
    encabezado.forEach((h, i) => { obj[h] = fila[i] !== undefined ? fila[i] : ''; });
    return obj;
  });
}

module.exports = { readCsv, readCsvObjects };
