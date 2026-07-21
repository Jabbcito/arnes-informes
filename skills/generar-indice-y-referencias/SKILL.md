---
name: generar-indice-y-referencias
description: Regenera el índice desde los títulos reales del documento y genera la lista de referencias APA desde los metadatos guardados.
---

## Disparador

Se pide explícitamente, o cambió la estructura del informe (se agregó/quitó una sección, tabla o figura).

## Qué hace

1. **Índice de contenidos:** lo reconstruye leyendo los títulos y subtítulos reales de `trabajo/informe.md`. No inventa números de página ni secciones que no existen en el documento. Es un campo real de Word (`--toc` de Pandoc), no una lista de texto — se actualiza con F9.
2. **Índice de tablas e índice de figuras** (en tesis): antes de generarlos, corre `node ../../comun/herramientas/verificar_estructura.js` (regla 20: `node --version` primero) para confirmar que la numeración de tablas/figuras está correlativa y sin duplicados; si detecta un problema, lo corrige antes de seguir. Como Pandoc no numera automáticamente, deja instrucción explícita al alumno del paso final en Word (Referencias → Insertar tabla de ilustraciones → Estilo `TableCaption`/`ImageCaption`, ver `../../comun/exportacion/exportar-word.md`) — este índice no lo genera Pandoc solo.
3. **Referencias:** genera la lista APA exclusivamente desde `fuentes/investigacion.md` / `fuentes/referencias.bib`, envuelta en `::: {custom-style="Bibliography"} ... :::` para que la sangría francesa se aplique de verdad al exportar (ver `../../comun/exportacion/exportar-word.md`). Verifica que toda fuente citada en el cuerpo tenga su referencia, y que toda referencia esté citada al menos una vez (sin referencias huérfanas). Solo el título "Referencias" va en negrita — las entradas no.

## No hace

No genera ninguna referencia desde la memoria del modelo, aunque el alumno lo pida — en ese caso responde que necesita el registro en `investigacion.md` primero.
