---
name: generar-slides
description: Convierte el informe aprobado en una presentación HTML editable, exportable a PDF (o PPTX como salida avanzada).
---

## Disparador

El informe ya está exportado y aprobado por el alumno.

## Qué hace

1. Extrae de `output/trabajo/informe.md` la idea central y la evidencia clave de cada sección.
2. Arma `output/trabajo/slides.md` con una idea por diapositiva (no párrafos completos del informe).
3. Genera la presentación partiendo de `../../comun/exportacion/plantillas/slides-base.html` (estructura del relato y reglas en `../../comun/exportacion/slides-html.md`), pensada para editarse rápido con ajustes visuales puntuales (el alumno adjunta una captura y pide un cambio concreto: contraste, tamaño, orden, gráfico).
4. Exporta a PDF con el procedimiento de impresión del navegador documentado en `../../comun/exportacion/slides-html.md`. PPTX queda como salida avanzada opcional, con revisión visual obligatoria antes de entregar.

## No hace

No repite el informe diapositiva por diapositiva; comunica, no transcribe.
