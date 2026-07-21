---
name: generar-tabla
description: Genera una tabla o figura numerada del informe/tesis (frecuencias, cruzada, correlación, operacionalización, comparativa, matriz de consistencia) con formato exportable a Word/PDF.
---

## Disparador

Cualquier sección necesita una tabla o figura, o el alumno pide una tabla puntual (ej. "genera la tabla de operacionalización de la variable 1", "haz la tabla de frecuencias de la dimensión 2", "arma una tabla comparativa de estos tres autores").

## Qué hace

Sigue `../../../tesis/contenido/tablas-y-figuras.md` (formato) y, si es la matriz de consistencia, `../../../tesis/contenido/matriz-de-consistencia.md`:

1. Identifica el tipo de tabla y su plantilla (frecuencias, cruzada, normalidad, correlación, operacionalización, población/muestra, confiabilidad, comparativa, matriz de consistencia).
2. Si el tipo requiere cálculo (frecuencias/cruzada → `../../../comun/herramientas/descriptivos.js`; correlación → `../../../comun/herramientas/correlacion.js`; confiabilidad → `../../../comun/herramientas/confiabilidad.js`; muestra → `../../../comun/herramientas/muestra.js`), verifica primero `node --version` (regla 20 de `../../../AGENTS.md`); si falla, sigue las instrucciones de `../../../comun/herramientas/README.md` en vez de calcular a mano.
3. La genera como tabla Markdown en el archivo que corresponde (`trabajo/informe.md` o `trabajo/matriz-consistencia.md`), con caption nativo de Pandoc (`Table: **Tabla N.** *Título*` debajo de la tabla — aparece arriba al exportar, ver `../../../comun/apa/tablas-figuras-apa.md`) y número correlativo correcto.
4. Llena las celdas solo con datos reales: del estudio del alumno (encuesta, ficha, SPSS/Excel que el alumno pegue) o de fuentes `VERIFICADA` (en comparativas de autores). Si el dato no existe aún, deja `[EVIDENCIA PENDIENTE]` en esa celda.
5. Escribe (o pide redactar con `redactar-seccion`) el párrafo de interpretación debajo de la tabla.
6. Si insertó la tabla en medio del documento, renumera las tablas posteriores y avisa que hay que regenerar el índice de tablas (`generar-indice-y-referencias`).
7. Marca las tablas anchas (operacionalización, matriz de consistencia) con una nota para orientación horizontal en el acabado final en Word.

## No hace

Nunca inventa cifras plausibles para llenar una tabla — ni frecuencias, ni porcentajes, ni coeficientes. Una tabla con estructura y `[EVIDENCIA PENDIENTE]` es correcta; una tabla con datos inventados es un fraude académico.
