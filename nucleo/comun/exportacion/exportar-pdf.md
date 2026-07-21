---
tema: Exportar el DOCX final a PDF y verificarlo
---

# Exportar a PDF

El PDF se genera SIEMPRE desde el DOCX ya acabado (con saltos de sección, numeración e índice actualizados) — nunca directamente desde Markdown, para que el PDF sea idéntico a lo que el docente vería en Word.

## Opciones

**El arnés no asume que el alumno tiene Word instalado** — la ruta principal (probada y funcionando) es LibreOffice, gratuito y disponible en cualquier sistema operativo:

1. **LibreOffice (ruta principal, sin depender de Word)**: `soffice --headless --convert-to pdf output/entregables/informe.docx --outdir output/entregables/`. Si `soffice` no está en el PATH de la terminal (frecuente en Windows aunque el programa sí esté instalado), usar la ruta completa al ejecutable, por ejemplo: `"C:\Program Files\LibreOffice\program\soffice.exe" --headless --convert-to pdf --outdir output/entregables output/entregables/informe.docx` — **verificado real**: exit 0, PDF generado correctamente con todas las páginas del documento.
2. **Word (si el alumno lo tiene):** Archivo → Guardar como → PDF (o Exportar → Crear PDF). Recomendado: activar "Crear marcadores usando: Títulos".
3. **Word para la Web / Google Docs:** subir el DOCX → Descargar como PDF (revisar que no se rompan fuentes).

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
