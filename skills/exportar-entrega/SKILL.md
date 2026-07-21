---
name: exportar-entrega
description: Genera la carátula final, exporta el informe a DOCX/PDF y corre el checklist final antes de entregar.
---

## Disparador

La auditoría de `auditar-tesis` está en verde (`trabajo/checklist-final.md`) — sin ella NO se exporta (regla 16 de `../../AGENTS.md`).

## Qué hace

1. Genera la carátula según el formato exacto exigido por la rúbrica/universidad (incluido jurado evaluador si el formato lo pide).
2. Si el trabajo es una tesis, inserta las declaratorias de autenticidad del asesor y de originalidad de los autores como plantilla vacía, marcadas `[PENDIENTE: FIRMA Y % DE SIMILITUD DEL ASESOR]` — nunca las completa con una firma o porcentaje simulado.
3. Re-verifica la coherencia título ↔ contenido: ¿el título sigue describiendo exactamente lo que la tesis terminó siendo? (ver `../../tesis/contenido/titulo-y-variables.md`). Si el alcance cambió durante el desarrollo, propone el ajuste antes de exportar.
4. Arma los anexos según `../../tesis/contenido/anexos.md`, con los marcadores `[PENDIENTE: ...]` en los que dependen de firmas o reportes externos, y verifica que cada anexo esté referenciado desde el cuerpo.
5. Exporta `trabajo/informe.md` a DOCX y PDF siguiendo `../../comun/exportacion/exportar-word.md` (Pandoc con `--from markdown+raw_attribute` + `../../comun/exportacion/plantillas/plantilla-apa.docx`) y `../../comun/exportacion/exportar-pdf.md`, confirmando que: el índice de contenidos coincide con el contenido real (campo de Word); las Declaratorias, Dedicatoria, Agradecimiento, Resumen y Abstract quedaron cada uno en su propia página (marcador de salto de página presente en `informe.md`); las Referencias están envueltas en `::: {custom-style="Bibliography"} :::`; **las tablas Markdown se conviertan en tablas nativas de Word editables** con caption nativo (no imágenes ni texto plano); las tablas anchas queden marcadas para orientación horizontal; y la numeración romana/arábiga se arme con los saltos de sección en el acabado final en Word.
6. Recuerda al alumno los pasos manuales de acabado en Word que Pandoc no puede automatizar: numeración romana/arábiga, e Insertar tabla de ilustraciones (por Estilo `TableCaption`/`ImageCaption`) para el índice de tablas y de figuras.
7. Corre `trabajo/checklist-final.md`: rúbrica cubierta, fuentes verificadas, sin evidencia pendiente, matriz de consistencia cuadrada, citas y referencias coherentes, título verificado y coherente, DOCX abre correctamente, PDF revisado.

## Regla dura

No exporta ni declara la entrega lista si queda algún `[EVIDENCIA PENDIENTE]`, una fuente sin verificar, o un criterio de la rúbrica sin cubrir — lo señala en vez de ocultarlo.
