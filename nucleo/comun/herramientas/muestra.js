#!/usr/bin/env node
/**
 * Calculadora de tamaño de muestra (población finita e infinita, con o sin estratos).
 *
 * Uso:
 *   node muestra.js --N 120                 # población finita, defaults Z=1.96 p=0.5 e=0.05
 *   node muestra.js --infinita              # población infinita/desconocida
 *   node muestra.js --N 500 --z 1.96 --p 0.5 --e 0.03
 *   node muestra.js --N 120 --estratos "Ciclo1:40,Ciclo2:35,Ciclo3:45"   # muestreo estratificado proporcional
 *   node muestra.js --interactivo           # pregunta los valores paso a paso, sin memorizar flags
 *   node muestra.js --N 120 --salida output/trabajo/calculo-muestra.md
 *
 * Imprime la fórmula con los valores sustituidos, para que el alumno pueda
 * explicar el cálculo en la sustentación. Sin dependencias externas.
 */
'use strict';
const readline = require('readline');
const { imprimirYGuardar } = require('./lib-salida');

function parseArgs(argv) {
  const a = { z: 1.96, p: 0.5, e: 0.05, infinita: false, interactivo: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--infinita') a.infinita = true;
    else if (arg === '--interactivo') a.interactivo = true;
    else if (arg === '--N') a.N = Number(argv[++i]);
    else if (arg === '--z') a.z = Number(argv[++i]);
    else if (arg === '--p') a.p = Number(argv[++i]);
    else if (arg === '--e') a.e = Number(argv[++i]);
    else if (arg === '--estratos') a.estratos = argv[++i];
    else if (arg === '--salida') a.salida = argv[++i];
    else { console.error(`Argumento no reconocido: ${arg}`); process.exit(2); }
  }
  return a;
}

function validar(a) {
  if (!a.infinita && a.N === undefined) {
    console.error('Indica --N <población> o --infinita');
    process.exit(2);
  }
  if (!(a.p > 0 && a.p < 1) || !(a.e > 0 && a.e < 1)) {
    console.error('p y e deben estar entre 0 y 1');
    process.exit(2);
  }
}

/** Fórmula pura: no imprime nada, solo calcula. Reutilizada por el modo por flags e interactivo. */
function calcular(a) {
  const q = 1 - a.p;
  let n, num, den, formula;
  if (a.infinita) {
    num = (a.z ** 2) * a.p * q;
    den = a.e ** 2;
    n = num / den;
    formula = {
      texto: 'Fórmula (población infinita): n = Z²·p·q / e²',
      sustitucion: `n = (${a.z}² × ${a.p} × ${q.toFixed(2)}) / ${a.e}²`,
      pasos: `n = ${num.toFixed(4)} / ${den.toFixed(4)}`,
    };
  } else {
    num = a.N * (a.z ** 2) * a.p * q;
    den = (a.e ** 2) * (a.N - 1) + (a.z ** 2) * a.p * q;
    n = num / den;
    formula = {
      texto: 'Fórmula (población finita): n = N·Z²·p·q / [e²·(N-1) + Z²·p·q]',
      sustitucion: `n = (${a.N} × ${a.z}² × ${a.p} × ${q.toFixed(2)}) / [${a.e}² × ${a.N - 1} + ${a.z}² × ${a.p} × ${q.toFixed(2)}]`,
      pasos: `n = ${num.toFixed(4)} / ${den.toFixed(4)}`,
    };
  }
  return { n, nRedondeado: Math.ceil(n), formula };
}

function lineasResultado(a, r) {
  return [
    r.formula.texto,
    `  ${r.formula.sustitucion}`,
    `  ${r.formula.pasos}`,
    `  n = ${r.n.toFixed(2)}`,
    '',
    `Tamaño de muestra (redondeado hacia arriba): ${r.nRedondeado}`,
    '',
    'Reporte sugerido: nivel de confianza según Z usado, margen de error e, p asumida.',
  ];
}

/** Parsea "Ciclo1:40,Ciclo2:35,Ciclo3:45" -> [{nombre:'Ciclo1', N:40}, ...] */
function parseEstratos(texto) {
  const estratos = texto.split(',').map((par) => {
    const [nombre, nStr] = par.split(':').map((s) => s.trim());
    const N = Number(nStr);
    if (!nombre || !Number.isFinite(N) || N <= 0) {
      console.error(`Estrato inválido: "${par}". Formato esperado: "Nombre:N,Nombre2:N2,..."`);
      process.exit(2);
    }
    return { nombre, N };
  });
  if (estratos.length < 2) {
    console.error('--estratos necesita al menos 2 grupos separados por coma.');
    process.exit(2);
  }
  return estratos;
}

/**
 * Afijación proporcional: n_h = round(n * N_h / N), con el último estrato
 * ajustado para que la suma cuadre exactamente con n (evita que el
 * redondeo independiente de cada estrato deje la suma en n±1).
 */
function afijacionProporcional(estratos, n) {
  const NTotal = estratos.reduce((acc, e) => acc + e.N, 0);
  const filas = estratos.map((e) => ({
    ...e,
    proporcion: e.N / NTotal,
    nh: Math.round(n * (e.N / NTotal)),
  }));
  const sumaParcial = filas.slice(0, -1).reduce((acc, f) => acc + f.nh, 0);
  filas[filas.length - 1].nh = Math.round(n) - sumaParcial;
  return { NTotal, filas };
}

function lineasEstratos(estratos, r) {
  const { NTotal, filas } = afijacionProporcional(estratos, r.nRedondeado);
  const lineas = [
    '',
    'Muestreo estratificado proporcional (afijación proporcional: n_h = n · N_h / N)',
    `N total (suma de estratos) = ${NTotal}`,
    '',
    '| Estrato | N_h | Proporción | n_h |',
    '|---|---|---|---|',
  ];
  for (const f of filas) {
    lineas.push(`| ${f.nombre} | ${f.N} | ${(f.proporcion * 100).toFixed(1)}% | ${f.nh} |`);
  }
  const sumaNh = filas.reduce((acc, f) => acc + f.nh, 0);
  lineas.push(`| Total | ${NTotal} | 100.0% | ${sumaNh} |`);
  lineas.push('');
  lineas.push(`(el último estrato se ajusta para que la suma de n_h coincida exactamente con n = ${r.nRedondeado})`);
  return lineas;
}

/**
 * Lector de líneas robusto para preguntas secuenciales.
 *
 * `rl.question()` encadenado falla con stdin no interactivo (pipe/redirección):
 * si todas las líneas llegan de golpe, solo la primera pregunta las recibe y
 * las siguientes se quedan esperando datos que ya pasaron. Este lector en
 * cambio encola cada línea que llega y la entrega a la siguiente pregunta que
 * la pida, sin importar si llegó antes o después de preguntar — funciona
 * igual en una terminal real (líneas una a una) que con datos redirigidos.
 */
function crearLector() {
  const rl = readline.createInterface({ input: process.stdin, terminal: false });
  const cola = [];
  const esperando = [];
  let cerrado = false;
  rl.on('line', (linea) => {
    if (esperando.length) esperando.shift()(linea);
    else cola.push(linea);
  });
  rl.on('close', () => {
    cerrado = true;
    while (esperando.length) esperando.shift()('');
  });
  function siguienteLinea() {
    if (cola.length) return Promise.resolve(cola.shift());
    if (cerrado) return Promise.resolve('');
    return new Promise((resolve) => esperando.push(resolve));
  }
  async function preguntar(texto) {
    process.stdout.write(texto);
    const linea = await siguienteLinea();
    return linea.trim();
  }
  return { preguntar, cerrar: () => rl.close() };
}

async function modoInteractivo() {
  const { preguntar, cerrar } = crearLector();
  console.log('Calculadora de tamaño de muestra — modo interactivo\n');

  const tipoResp = await preguntar('¿Población finita (conocida) o infinita/desconocida? [finita/infinita] (finita): ');
  const infinita = tipoResp.toLowerCase().startsWith('inf');

  const a = { infinita, z: 1.96, p: 0.5, e: 0.05 };

  if (!infinita) {
    const NResp = await preguntar('Tamaño de la población (N): ');
    a.N = Number(NResp);
  }
  const zResp = await preguntar(`Nivel de confianza Z [1.96 = 95%, 2.58 = 99%] (${a.z}): `);
  if (zResp) a.z = Number(zResp);
  const pResp = await preguntar(`Proporción esperada p [0-1] (${a.p}): `);
  if (pResp) a.p = Number(pResp);
  const eResp = await preguntar(`Margen de error e [0-1] (${a.e}): `);
  if (eResp) a.e = Number(eResp);

  const estratosResp = await preguntar('¿Es muestreo estratificado? Si sí, escribe los estratos como "Nombre:N,Nombre2:N2,..." (Enter para omitir): ');
  if (estratosResp) a.estratos = estratosResp;

  cerrar();

  validar(a);
  const r = calcular(a);
  let lineas = lineasResultado(a, r);
  if (a.estratos) lineas = lineas.concat(lineasEstratos(parseEstratos(a.estratos), r));
  console.log('');
  imprimirYGuardar(lineas, a.salida);
}

function modoFlags(a) {
  validar(a);
  const r = calcular(a);
  let lineas = lineasResultado(a, r);
  if (a.estratos) lineas = lineas.concat(lineasEstratos(parseEstratos(a.estratos), r));
  imprimirYGuardar(lineas, a.salida);
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  if (a.interactivo) {
    modoInteractivo();
  } else {
    modoFlags(a);
  }
}

main();
