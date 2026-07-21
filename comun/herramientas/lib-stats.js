/**
 * Utilidades estadísticas compartidas, sin dependencias externas.
 */
'use strict';

function mean(xs) {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

// Varianza muestral (n-1), igual convención que SPSS.
function varianceSample(xs) {
  const m = mean(xs);
  const sumSq = xs.reduce((a, x) => a + (x - m) ** 2, 0);
  return sumSq / (xs.length - 1);
}

// ---------- t de Student: p-valor bilateral vía beta incompleta regularizada ----------

function logGamma(x) {
  // Aproximación de Lanczos (misma que usan la mayoría de librerías numéricas)
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (x < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
  }
  x -= 1;
  let a = c[0];
  const t = x + g + 0.5;
  for (let i = 1; i < g + 2; i++) a += c[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

function betacf(a, b, x, itmax = 200, eps = 3e-9) {
  let am = 1.0, bm = 1.0, az = 1.0;
  const qab = a + b, qap = a + 1.0, qam = a - 1.0;
  let bz = 1.0 - (qab * x) / qap;
  for (let m = 1; m <= itmax; m++) {
    const em = m;
    const tem = em + em;
    let d = (em * (b - m) * x) / ((qam + tem) * (a + tem));
    const ap = az + d * am;
    const bp = bz + d * bm;
    d = (-(a + em) * (qab + em) * x) / ((a + tem) * (qap + tem));
    const app = ap + d * az;
    const bpp = bp + d * bz;
    const aold = az;
    am = ap / bpp; bm = bp / bpp;
    az = app / bpp; bz = 1.0;
    if (Math.abs(az - aold) < eps * Math.abs(az)) return az;
  }
  return az;
}

function betai(a, b, x) {
  if (x <= 0.0) return 0.0;
  if (x >= 1.0) return 1.0;
  const lbeta = logGamma(a + b) - logGamma(a) - logGamma(b);
  const bt = Math.exp(lbeta + a * Math.log(x) + b * Math.log(1.0 - x));
  if (x < (a + 1.0) / (a + b + 2.0)) return (bt * betacf(a, b, x)) / a;
  return 1.0 - (bt * betacf(b, a, 1.0 - x)) / b;
}

// p-valor bilateral para un estadístico t con gl grados de libertad.
function pBilateralT(t, gl) {
  return betai(gl / 2.0, 0.5, gl / (gl + t * t));
}

module.exports = { mean, varianceSample, pBilateralT };
