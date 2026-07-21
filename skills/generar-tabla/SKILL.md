---
name: generar-tabla
description: Genera una tabla o figura numerada del informe/tesis (frecuencias, cruzada, correlación, operacionalización, comparativa, matriz de consistencia) con formato exportable a Word/PDF.
---

## Disparador

Cualquier sección necesita una tabla o figura, o el alumno pide una tabla puntual (ej. "genera la tabla de operacionalización de la variable 1", "haz la tabla de frecuencias de la dimensión 2", "arma una tabla comparativa de estos tres autores").

## Qué hace

Sigue `../../tesis/contenido/tablas-y-figuras.md` (formato) y, si es la matriz de consistencia, `../../tesis/contenido/matriz-de-consistencia.md`:

1. Identifica el tipo de tabla y su plantilla (frecuencias, cruzada, descriptivos numéricos, correlación, chi-cuadrado, t de Student, ANOVA, operacionalización, población/muestra, confiabilidad, comparativa, matriz de consistencia).
2. Si el tipo requiere cálculo, verifica primero `node --version` (regla 20 de `../../AGENTS.md`); si falla, sigue las instrucciones de `../../comun/herramientas/README.md` en vez de calcular a mano. Script según el tipo: frecuencias/cruzada → `descriptivos.js`; descriptivos numéricos (media/mediana/moda/DE) → `descriptivos-numericos.js`; correlación → `correlacion.js`; chi-cuadrado → `chi-cuadrado.js`; t de Student (2 grupos) → `prueba-t.js`; ANOVA (3+ grupos) → `anova.js`; confiabilidad → `confiabilidad.js`; muestra → `muestra.js` — todos en `../../comun/herramientas/`. **Corre el script con `--salida output/trabajo/calculo-tabla-N.md`** y copia el contenido de ese archivo a la tabla, nunca retipeando de memoria lo que se vio en la terminal (regla 29 de `../../AGENTS.md`, fidelidad de datos).
3. La genera como tabla Markdown en el archivo que corresponde (`output/trabajo/informe.md` o `output/trabajo/matriz-consistencia.md`), con caption nativo de Pandoc (`Table: **Tabla N.** *Título*` debajo de la tabla — aparece arriba al exportar, ver `../../comun/apa/tablas-figuras-apa.md`) y número correlativo correcto. Máximo 4-5 columnas y celdas con frases cortas, no oraciones completas — una tabla con más columnas u oraciones largas queda ilegible incluso en horizontal (verificado, ver `../../comun/exportacion/exportar-word.md`).
4. Llena las celdas solo con datos reales: del estudio del alumno (encuesta, ficha, salida real de los scripts, o SPSS/Excel que el alumno pegue) o de fuentes `VERIFICADA` (en comparativas de autores). Si el dato no existe aún, deja `[EVIDENCIA PENDIENTE]` en esa celda.
5. Escribe (o pide redactar con `redactar-seccion`) el párrafo de interpretación debajo de la tabla.
6. Si insertó la tabla en medio del documento, renumera las tablas posteriores y avisa que hay que regenerar el índice de tablas (`generar-indice-y-referencias`).
7. Si la tabla es ancha (operacionalización, matriz de consistencia), envuélvela con los bloques OOXML de sección horizontal automática (`../../comun/exportacion/exportar-word.md`, "Tablas anchas") — no es un paso manual que quede pendiente para el acabado en Word, se aplica al redactar.

## No hace

Nunca inventa cifras plausibles para llenar una tabla — ni frecuencias, ni porcentajes, ni coeficientes. Una tabla con estructura y `[EVIDENCIA PENDIENTE]` es correcta; una tabla con datos inventados es un fraude académico.
