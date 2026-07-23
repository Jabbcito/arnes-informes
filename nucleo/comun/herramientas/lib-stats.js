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

function standardDeviation(xs) {
  return Math.sqrt(varianceSample(xs));
}

// Correlación de Pearson entre dos vectores numéricos de igual longitud.
function pearson(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  return sxy / Math.sqrt(sxx * syy);
}

function median(xs) {
  const ys = [...xs].sort((a, b) => a - b);
  const n = ys.length;
  const mid = Math.floor(n / 2);
  return n % 2 === 0 ? (ys[mid - 1] + ys[mid]) / 2 : ys[mid];
}

// Moda: valor(es) más frecuente(s). Devuelve un array (puede haber empate/multimodal).
function mode(xs) {
  const cnt = new Map();
  for (const x of xs) cnt.set(x, (cnt.get(x) || 0) + 1);
  const maxFreq = Math.max(...cnt.values());
  return [...cnt.entries()].filter(([, f]) => f === maxFreq).map(([v]) => v).sort((a, b) => a - b);
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

// p-valor (cola derecha) para un estadístico F con gl1/gl2 grados de libertad.
// Se reutiliza la misma beta incompleta regularizada que ya usa pBilateralT
// (relación conocida entre la distribución F y la Beta: no hace falta código nuevo).
function pF(f, gl1, gl2) {
  if (f <= 0) return 1.0;
  return betai(gl2 / 2.0, gl1 / 2.0, gl2 / (gl2 + gl1 * f));
}

// ---------- Chi-cuadrado: p-valor vía función gamma incompleta regularizada ----------
// Mismo estilo (Numerical Recipes) que logGamma/betacf/betai de arriba.

function gammaSerie(a, x, itmax = 200, eps = 3e-9) {
  let ap = a;
  let sum = 1.0 / a;
  let del = sum;
  for (let n = 1; n <= itmax; n++) {
    ap += 1;
    del *= x / ap;
    sum += del;
    if (Math.abs(del) < Math.abs(sum) * eps) break;
  }
  return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
}

function gammaCF(a, x, itmax = 200, eps = 3e-9, fpmin = 1e-30) {
  let b = x + 1 - a;
  let c = 1 / fpmin;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i <= itmax; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < fpmin) d = fpmin;
    c = b + an / c;
    if (Math.abs(c) < fpmin) c = fpmin;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < eps) break;
  }
  return Math.exp(-x + a * Math.log(x) - logGamma(a)) * h;
}

// Función gamma incompleta inferior regularizada P(a,x) = γ(a,x)/Γ(a).
function gammaP(a, x) {
  if (x < 0 || a <= 0) throw new Error('gammaP: argumentos inválidos');
  if (x === 0) return 0;
  return x < a + 1 ? gammaSerie(a, x) : 1 - gammaCF(a, x);
}

// p-valor (cola derecha) de chi-cuadrado: P(X² ≥ x2) con gl grados de libertad.
function pChiCuadrado(x2, gl) {
  if (x2 <= 0) return 1.0;
  return 1 - gammaP(gl / 2.0, x2 / 2.0);
}

module.exports = { mean, varianceSample, standardDeviation, pearson, median, mode, pBilateralT, pF, pChiCuadrado };
