---
name: generar-slides
description: Convierte el informe aprobado en una presentación HTML editable, exportable a PDF y a PPTX real y editable.
---

## Disparador

El informe ya está exportado y aprobado por el alumno.

## Qué hace

1. Extrae de `output/trabajo/informe.md` la idea central y la evidencia clave de cada sección.
2. Arma `output/trabajo/slides.md` con una idea por diapositiva (no párrafos completos del informe).
3. Genera la presentación partiendo de `../../comun/exportacion/plantillas/slides-base.html` (estructura del relato y reglas en `../../comun/exportacion/slides-html.md`), pensada para editarse rápido con ajustes visuales puntuales (el alumno adjunta una captura y pide un cambio concreto: contraste, tamaño, orden, gráfico). El resultado revisado se guarda en `output/entregables/presentacion.html`.
4. Exporta a PDF con el procedimiento de impresión del navegador documentado en `../../comun/exportacion/slides-html.md`.
5. Genera el PPTX real: `node nucleo/comun/herramientas/generar_slides_pptx.js output/entregables/presentacion.html --salida output/entregables/presentacion.pptx` (requiere `npm install` corrido una vez en la raíz — ver `../../../AGENTS.md`, regla 30). Ya no es una salida "opcional avanzada": se genera siempre. El layout es una aproximación editable, no un calco pixel a pixel del HTML — la revisión visual final en PowerPoint/Impress sigue siendo obligatoria antes de entregar.

## No hace

No repite el informe diapositiva por diapositiva; comunica, no transcribe. No entrega el PPTX sin que el alumno lo haya abierto y revisado visualmente al menos una vez.
