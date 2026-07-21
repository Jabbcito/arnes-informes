---
tema: Referencia de fórmulas estadísticas usadas en tesis
---

# Referencia de fórmulas

Complementa a `elegir-diseno.md` (cuál usar) y a los scripts de `../herramientas/` (cómo calcular). Aquí está cada fórmula escrita y explicada, para que el alumno la entienda y la pueda escribir en su Metodología y defender en la sustentación. **Ningún resultado numérico sale de leer este archivo: se calcula con el script o con SPSS.**

## Tamaño de muestra (proporciones)

**Población finita:**  n = N·Z²·p·q / [e²·(N−1) + Z²·p·q]

**Población infinita:**  n = Z²·p·q / e²

| Término | Significado | Valores típicos |
|---|---|---|
| N | Tamaño de la población | dato real del alumno |
| Z | Valor Z del nivel de confianza | 1.645 (90%), 1.96 (95%), 2.58 (99%) |
| p | Proporción esperada | 0.5 si se desconoce (caso más exigente) |
| q | 1 − p | 0.5 |
| e | Margen de error | 0.05 (5%) o 0.03 (3%) |

→ `node ../herramientas/muestra.js --N 120`

## Confiabilidad

**Alfa de Cronbach** (escalas tipo Likert):  α = (k/(k−1)) · (1 − ΣVi/Vt) — k: nº de ítems; Vi: varianza de cada ítem; Vt: varianza de los puntajes totales.

**KR-20** (ítems dicotómicos 0/1):  KR20 = (k/(k−1)) · (1 − Σp·q/Vt) — p: proporción de aciertos del ítem; q = 1−p.

Interpretación usual: ≥0.9 excelente · ≥0.8 buena · ≥0.7 aceptable · <0.7 revisar ítems.

**V de Aiken** (cuantificar juicio de expertos):  V = S / (n·(c−1)) — S: suma de valoraciones sobre el mínimo; n: nº de jueces; c: nº de categorías de la escala. Se reporta por ítem y global.

→ `node ../herramientas/confiabilidad.js piloto.csv`

## Normalidad

- **Shapiro-Wilk**: n < 50. — **Kolmogórov-Smirnov**: n ≥ 50. (En SPSS/Jamovi.)
- H0: los datos siguen distribución normal. Si sig. < 0.05 → se rechaza H0 → datos NO normales → pruebas no paramétricas.

## Correlación

**r de Pearson** (datos normales, escala de intervalo):  r = Σ(x−x̄)(y−ȳ) / √[Σ(x−x̄)²·Σ(y−ȳ)²]

**rho de Spearman** (datos no normales u ordinales): mismo cálculo de Pearson pero sobre los **rangos** de los datos (empates: rango promedio).

Significancia: t = r·√[(n−2)/(1−r²)] contra t de Student con gl = n−2 (bilateral).

Interpretación del coeficiente (|r|): ≥0.9 muy alta · ≥0.7 alta · ≥0.4 moderada · ≥0.2 baja · <0.2 muy baja/nula. Signo: + directa, − inversa.

Reporte: (rho=−0.799; p<0.001) → `node ../herramientas/correlacion.js datos.csv --x V1 --y V2`

## Comparación de grupos (en SPSS/Jamovi)

| Situación | Normales | No normales |
|---|---|---|
| Un grupo, pre-post (pareadas) | t de Student pareada | Wilcoxon |
| Dos grupos independientes | t de Student independiente | U de Mann-Whitney |
| Tres o más grupos | ANOVA de un factor | Kruskal-Wallis |

Reporte típico: (t=X.XX; gl=XX; p=0.XXX) · (F=X.XX; gl=X,XX; p=0.XXX) · (U=XX; p=0.XXX).

## Asociación de categóricas

**Chi-cuadrado de independencia**:  χ² = Σ (O−E)²/E — O: frecuencia observada; E: esperada = (total fila × total columna)/n. gl = (filas−1)·(columnas−1). Requisito usual: <20% de celdas con E<5. Reporte: (χ²=X.XX; gl=X; p=0.XXX).

## Cómo se escribe en la tesis

En Metodología (método de análisis de datos) se nombra la prueba y por qué corresponde (diseño + escala + normalidad). En Resultados se reporta con el formato entre paréntesis indicado arriba, junto a su tabla (ver `../../tesis/contenido/resultados.md`).
