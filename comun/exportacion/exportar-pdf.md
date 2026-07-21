---
tema: Exportar el DOCX final a PDF y verificarlo
---

# Exportar a PDF

El PDF se genera SIEMPRE desde el DOCX ya acabado (con saltos de sección, numeración e índice actualizados) — nunca directamente desde Markdown, para que el PDF sea idéntico a lo que el docente vería en Word.

## Opciones

1. **Word:** Archivo → Guardar como → PDF (o Exportar → Crear PDF). Recomendado: activar "Crear marcadores usando: Títulos".
2. **Word para la Web / Google Docs:** subir el DOCX → Descargar como PDF (revisar que no se rompan fuentes).
3. **LibreOffice (sin licencia de Word):** `soffice --headless --convert-to pdf entregables/informe.docx --outdir entregables/`

## Checklist visual del PDF (abrir y revisar página por página las críticas)

- [ ] Carátula completa y centrada correctamente.
- [ ] Preliminares en romanos, cuerpo en arábigos, sin páginas descuadradas.
- [ ] Índice: los números de página coinciden con las páginas reales.
- [ ] Índices de tablas y figuras coinciden con las tablas/figuras reales.
- [ ] Ninguna tabla cortada por la mitad sin repetir encabezado; las anchas en horizontal.
- [ ] Imágenes de anexos legibles (hacer zoom a 100%).
- [ ] Referencias con sangría francesa conservada.
- [ ] El archivo abre en un visor distinto al que lo generó (ej. navegador) sin errores.

> "Descargar, abrir, revisar, recién enviar."
