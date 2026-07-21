/**
 * Salida compartida para los scripts de cálculo: imprime en terminal y,
 * si se pasa --salida, escribe el mismo texto (carácter por carácter) a un
 * archivo — para que el resultado se copie a informe.md desde el archivo,
 * nunca retipeado de memoria de lo que se vio en la terminal (regla 29 de
 * ../../AGENTS.md: fidelidad de datos).
 */
'use strict';
const fs = require('fs');
const path = require('path');

function imprimirYGuardar(lineas, rutaSalida) {
  const texto = lineas.join('\n');
  console.log(texto);
  if (rutaSalida) {
    fs.mkdirSync(path.dirname(rutaSalida), { recursive: true });
    fs.writeFileSync(rutaSalida, texto + '\n', 'utf8');
    console.error(`\n(Copiado también a ${rutaSalida} — copia desde ahí a informe.md, no de memoria.)`);
  }
}

module.exports = { imprimirYGuardar };
