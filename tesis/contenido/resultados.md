---
seccion: Resultados
aplica_a: tesis
---

# Resultados

1. **Resultados descriptivos**: una tabla de frecuencias por variable y por cada dimensión, seguida siempre de un párrafo de interpretación (qué categoría es más frecuente, con su %, y una lectura breve). Después, tablas cruzadas (variable x variable, o dimensión x variable) con su propia interpretación.
2. **Análisis inferencial**: prueba de normalidad (con hipótesis H0/H1 explícitas) → justificación de qué prueba estadística corresponde → prueba de hipótesis general (H0/H1, tabla de correlación/significancia, interpretación) → prueba de cada hipótesis específica, en el mismo formato.

## Regla dura

Ningún resultado se redacta sin la tabla o cifra real que lo respalda — no se narra un resultado "en general" ni se estima una cifra plausible. Los datos de esta sección vienen del propio estudio del alumno (encuesta, ficha, registro), no de fuentes externas, y específicamente de `output/trabajo/datos-principales.csv` — el dataset de aplicar el instrumento ya validado a toda la muestra, nunca del CSV del piloto. Este es el segundo punto de control del arnés (el primero es el gate de confiabilidad): sin ese archivo, esta sección se marca `[EVIDENCIA PENDIENTE]` y no se redacta. Ver `recoleccion-datos-principal.md` y la skill `recolectar-datos-principales`.

Las tablas de frecuencias y cruzadas se generan con `node ../../comun/herramientas/descriptivos.js` (salida Markdown lista para pegar); correlaciones con `node ../../comun/herramientas/correlacion.js`; pruebas que exigen software especializado (normalidad, t de Student, ANOVA, chi-cuadrado) se corren en SPSS/Jamovi y el alumno pega el resultado (regla 17 de `../../AGENTS.md`). Qué prueba corresponde al diseño: `../../comun/formulas/elegir-diseno.md`.

## No hacer

No adelantar interpretación causal ni comparación con antecedentes aquí — eso es tarea de `discusion.md`. Resultados solo presenta e interpreta lo propio.
