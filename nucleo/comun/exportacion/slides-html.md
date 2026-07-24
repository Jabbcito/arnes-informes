---
tema: Presentación de sustentación en HTML y su exportación a PDF
---

# Slides HTML → PDF

## Plantilla

`plantillas/slides-base.html` — autocontenida (sin librerías externas), 16:9 (1280×720), lista para editar. Estructura del relato, una idea por diapositiva:

1. Portada (título, autor, asesor).
2. El problema (cifra más fuerte + pregunta general).
3. Objetivos.
4. Método (tipo/diseño, muestra, instrumento con su confiabilidad, prueba estadística).
5. Resultado principal (el estadístico grande + tabla resumida) — máximo 2-3 slides de resultados.
6. Conclusiones (con estadísticos) + idea para el jurado.
7. Recomendaciones + cierre.

## Reglas de contenido

- Los datos de las slides salen de `output/trabajo/informe.md` YA aprobado — la presentación nunca dice algo que la tesis no diga.
- Tablas: máximo 4-5 filas — se resume o se convierte en cifra destacada; nunca se pega la tabla completa del informe.
- Colores: cambiar las variables `--primario`/`--acento` del CSS por los de la universidad.
- Cambios visuales: el alumno toma captura de la slide y pide el ajuste concreto (contraste, tamaño, orden).

## Exportar a PDF

**Manual (el alumno, con cualquier navegador):**
1. Abrir el HTML en Chrome/Edge (doble clic).
2. Ctrl+P → Destino: **Guardar como PDF**.
3. Márgenes: **Ninguno** · Activar **Gráficos de fondo**. (El tamaño de página lo fija el `@page` del CSS — no hace falta configurarlo.)
4. Guardar en `output/entregables/presentacion.pdf`.

**Automático (si el arnés lo hace por el alumno, con Edge o Chrome ya instalados):** `msedge --headless --disable-gpu --print-to-pdf="output/entregables/presentacion.pdf" --no-pdf-header-footer "file:///ruta/completa/al/slides.html"` (usar la ruta completa al ejecutable si `msedge`/`chrome` no están en el PATH, ej. en Windows `"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"`) — **verificado real**: PDF de 7 páginas generado correctamente, una página por slide, sin recorte.

## Exportar a PPTX real

`node nucleo/comun/herramientas/generar_slides_pptx.js output/entregables/presentacion.html --salida output/entregables/presentacion.pptx` — usa `pptxgenjs` (`npm install` una vez en la raíz, ver `AGENTS.md` regla 30) para generar un `.pptx` real y editable, parseando el HTML ya revisado (no `slides.md`, para que nunca diverja de lo aprobado): título, viñetas, cifra destacada, callout y tablas, con los mismos colores `--primario`/`--acento` del CSS. **Verificado real**: 7 diapositivas generadas correctamente (título centrado, viñetas con negrita parcial, callout con borde de acento, cifra grande, tabla con encabezado en negrita), confirmado visualmente exportando el `.pptx` a PDF con LibreOffice. El layout es una aproximación editable, no un calco pixel a pixel — sirve para terminar de ajustar en PowerPoint, no para entregar sin revisar.

## Verificación

- [ ] Cada slide ocupa exactamente una página del PDF (sin cortes ni páginas en blanco).
- [ ] Colores y franja inferior visibles (si salen en blanco: faltó "Gráficos de fondo").
- [ ] Texto legible proyectado: fuente mínima ~22px en el HTML.
- [ ] Ningún marcador `[...]` de la plantilla quedó sin reemplazar.
- [ ] PPTX: abrir `presentacion.pptx` en PowerPoint/Impress y revisar visualmente (colores, cortes de texto, tablas) antes de entregar — no es opcional.
