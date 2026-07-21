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

1. Abrir el HTML en Chrome/Edge (doble clic).
2. Ctrl+P → Destino: **Guardar como PDF**.
3. Márgenes: **Ninguno** · Activar **Gráficos de fondo**. (El tamaño de página lo fija el `@page` del CSS — no hace falta configurarlo.)
4. Guardar en `output/entregables/presentacion.pdf`.

## Verificación

- [ ] Cada slide ocupa exactamente una página del PDF (sin cortes ni páginas en blanco).
- [ ] Colores y franja inferior visibles (si salen en blanco: faltó "Gráficos de fondo").
- [ ] Texto legible proyectado: fuente mínima ~22px en el HTML.
- [ ] Ningún marcador `[...]` de la plantilla quedó sin reemplazar.
- [ ] PPTX (opcional avanzado): importar el PDF en PowerPoint/Slides o rehacer sobre plantilla de la universidad; revisión visual obligatoria.
