---
tema: Qué fórmulas y pruebas corresponden a cada tipo de estudio
---

# Elegir diseño → fórmulas y pruebas

Archivo de entrada de `comun/formulas/`. El diseño se declara en la matriz de consistencia y la Metodología; de ahí sale TODO lo estadístico. Cada celda indica la herramienta: script de `../herramientas/` o SPSS/Jamovi (el alumno corre y pega el resultado real — regla 17 de `../../../AGENTS.md`).

## Árbol de decisión por tipo de estudio

### 1. Correlacional (¿se relacionan X e Y?) — el más común en tesis de pregrado

| Paso | Qué se usa | Herramienta |
|---|---|---|
| Muestra | Fórmula de población finita/infinita | `../herramientas/muestra.js` |
| Confiabilidad del instrumento | Alfa de Cronbach (Likert) / KR-20 (dicotómico) | `../herramientas/confiabilidad.js` o SPSS |
| Descriptivos | Frecuencias por variable y dimensión + cruzadas | `../herramientas/descriptivos.js` |
| Normalidad | Shapiro-Wilk (n<50) / Kolmogórov-Smirnov (n≥50) | SPSS/Jamovi |
| Prueba de hipótesis | Datos normales → r de Pearson; no normales → rho de Spearman | `../herramientas/correlacion.js` (contrastar con SPSS) |
| Reporte | (rho=±0.XXX; p=0.XXX) por cada hipótesis | — |

### 2. Descriptivo (¿cómo es X?)

Muestra (`../herramientas/muestra.js`) → confiabilidad (`../herramientas/confiabilidad.js`) → frecuencias y cruzadas (`../herramientas/descriptivos.js`) + medidas de tendencia central. **Sin hipótesis inferencial** — no se aplican pruebas de correlación.

### 3. Pre-experimental (un grupo, pre-test y post-test)

| Paso | Qué se usa | Herramienta |
|---|---|---|
| Muestra | Con frecuencia censo o muestreo por conveniencia (justificar) | — |
| Normalidad de las DIFERENCIAS pre-post | Shapiro-Wilk | SPSS/Jamovi |
| Prueba | Normales → **t de Student pareada**; no normales → **Wilcoxon** | SPSS/Jamovi (pareada/Wilcoxon no están en `../herramientas/` — ver nota de límites abajo) |
| Reporte | (t=X.XX; gl=N-1; p=0.XXX) o (Z=X.XX; p=0.XXX) | — |

### 4. Cuasi-experimental / experimental (grupo experimental vs control)

Normalidad por grupo (Shapiro-Wilk/K-S, SPSS/Jamovi) →
- **2 grupos**: normales → **t de Student para muestras independientes**, `../herramientas/prueba-t.js` (Welch, no exige antes una prueba de igualdad de varianzas); no normales → **U de Mann-Whitney** (SPSS/Jamovi, no está en `../herramientas/`).
- **3+ grupos**: normales → **ANOVA de un factor**, `../herramientas/anova.js` (sin comparaciones post-hoc — si sale significativo y hace falta saber qué pares difieren, eso sí en SPSS/Jamovi); no normales → **Kruskal-Wallis** (SPSS/Jamovi).

### 5. Asociación entre variables categóricas (niveles, no puntajes)

**Chi-cuadrado de independencia** sobre la tabla cruzada: `../herramientas/chi-cuadrado.js` (calcula la tabla, el estadístico, gl, p-valor y V de Cramér en un solo paso — igual que `Crosstabs` de SPSS con la opción de chi-cuadrado activada). Reporte: (χ²(gl, N=n)=X.XX; p=0.XXX; V=X.XX).

### 6. Documental / revisión (análisis de documentos, tesis, registros)

Sin muestra probabilística clásica: la "población" son los documentos, con criterios de inclusión/exclusión. Solo descriptivos (`../herramientas/descriptivos.js`: frecuencias por año, tipo, etc.). Sin pruebas de hipótesis inferenciales, salvo que la rúbrica pida otra cosa.

### 7. Cualitativo (entrevistas, focus groups, observación)

Sin fórmulas estadísticas: muestreo por saturación/conveniencia justificado, categorización y triangulación. Los "instrumentos" se validan por juicio de expertos (V de Aiken si se cuantifica — ver `formulas-referencia.md`).

## Regla de coherencia

La prueba elegida DEBE coincidir con: (a) el diseño declarado en Metodología 3.1, (b) la escala de medición de la operacionalización (3.2), y (c) el resultado real de la prueba de normalidad. Elegir Spearman "porque es lo común" sin haber corrido la normalidad es un error que el asesor detecta — el orden es siempre: normalidad primero, prueba después.
