---
seccion: Recolección de datos principal (gate previo a Resultados)
aplica_a: tesis
---

# Recolección de datos principal — antes de redactar Resultados

Este es el **segundo punto de control** del arnés (el primero es `instrumento-y-muestra.md`, que valida el instrumento con el piloto). Ninguna skill redacta Resultados, Discusión, Conclusiones ni Recomendaciones sin pasar por esta secuencia completa.

## Precondición

El instrumento ya está validado: Metodología 3.4 tiene un alfa de Cronbach real ≥ 0.70 (o el umbral del brief), calculado por `../../comun/herramientas/confiabilidad.js` sobre el piloto (ver `instrumento-y-muestra.md`). Sin eso, no se llega a este paso — se retoma en `construir-instrumento`.

## Secuencia obligatoria

1. **Aplicar el instrumento ya validado a toda la muestra**: el mismo cuestionario/ficha que pasó el piloto (no una versión distinta), aplicado a los `n` casos calculados en Metodología 3.3 (o a toda la población si el diseño es censo/documental — ver `../../comun/formulas/elegir-diseno.md`). Esto es trabajo de campo real del alumno, **fuera del arnés** — la IA no puede simularlo ni generarlo.
2. **Traer el dataset completo**: el alumno guarda los resultados reales en `output/trabajo/datos-principales.csv` (filas = encuestados/casos reales, columnas = ítems o variables — mismo formato que espera `../../comun/herramientas/descriptivos.js` y `../../comun/herramientas/correlacion.js`). El arnés no continúa sin este archivo.
3. **Chequeo de sanidad (de conteo, no estadístico)**: comparar el número de filas del CSV contra el `n` registrado en Metodología 3.3. Si difiere bastante, avisar al alumno (puede ser un CSV incompleto, de otro estudio, o de una etapa de piloto por error) — pero no bloquear si el alumno confirma que el número es correcto (por ejemplo, ya descontó la tasa de no-respuesta al calcular `n`, o el diseño es un censo).
4. Solo con este archivo real presente: correr `node ../../comun/herramientas/descriptivos.js output/trabajo/datos-principales.csv ...` y `node ../../comun/herramientas/correlacion.js output/trabajo/datos-principales.csv ...` para las tablas de Resultados, y recién entonces redactar la sección.

## Regla dura

**No se redacta Resultados, Discusión, Conclusiones ni Recomendaciones sin `output/trabajo/datos-principales.csv` real.** Nunca se usa el CSV del piloto (`output/trabajo/piloto.csv`) para esto — el piloto solo sirve para validar el instrumento, no para reportar resultados de la investigación. Nunca se inventan filas "de ejemplo" para poder avanzar más rápido mientras el alumno termina de recolectar: si el archivo no existe todavía, se marca `[EVIDENCIA PENDIENTE]` en Resultados y se detiene ahí.

## Por qué este orden importa

Confundir el piloto (para validar el instrumento) con la recolección principal (para responder la pregunta de investigación) es un error común que invalida los resultados: el piloto casi siempre es una muestra pequeña y no representativa (~15 casos) elegida solo para probar el instrumento, no para generalizar conclusiones. Separar ambos archivos (`piloto.csv` vs `datos-principales.csv`) hace ese límite imposible de cruzar por accidente.
