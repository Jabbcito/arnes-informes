---
seccion: Tablas y figuras (transversal)
aplica_a: tesis
---

# Tablas y figuras

Las tesis reales analizadas usan tablas intensivamente: 15-19 tablas numeradas por tesis. El arnés debe generarlas como tablas Markdown dentro de `trabajo/informe.md`, con un formato que sobreviva la exportación a DOCX/PDF.

**Formato por defecto: APA 7** (`../../comun/apa/tablas-figuras-apa.md`: "Tabla N" en negrita, título en cursiva línea aparte, solo bordes horizontales, "*Nota.*"). La alternativa es el formato propio de la universidad (el observado en tesis UCV/UPAO, descrito abajo) — la elección se registra en `trabajo/brief.md` y se aplica en todo el documento (regla 18 de `../../AGENTS.md`). Los datos numéricos de las tablas se generan con los scripts (`node ../../comun/herramientas/descriptivos.js`) o los pega el alumno desde SPSS — nunca los redacta la IA de memoria (regla 17).

## Formato estándar de una tabla (sintaxis con caption nativo, ver `../../comun/apa/tablas-figuras-apa.md`)

```markdown
| ... | ... |
|---|---|
| ... | ... |

Table: **Tabla N.** *Título descriptivo de la tabla (qué muestra, de qué variable/dimensión)*

*Nota.* [origen de los datos — "elaboración propia", el instrumento aplicado, o la fuente verificada]
```

El caption se escribe debajo de la tabla en el Markdown, pero al exportar aparece arriba de la tabla (ver detalle técnico en `../../comun/apa/tablas-figuras-apa.md`).

Reglas:

1. **Numeración correlativa única** en todo el documento (Tabla 1, Tabla 2, ...), en orden de aparición. Si se inserta una tabla nueva en medio, se renumeran todas las posteriores y se regenera el índice de tablas.
2. **Título arriba (en el DOCX exportado), fuente abajo.** El título dice qué muestra; la fuente dice de dónde salen los datos.
3. **Toda tabla se comenta**: después de cada tabla va un párrafo de interpretación (ver `resultados.md` y la plantilla de redacción abajo). Ninguna tabla queda "huérfana" sin lectura.
4. **Datos reales únicamente**: las celdas se llenan con datos del propio estudio del alumno (encuesta, ficha, registros) o de una fuente `VERIFICADA` citada en la fuente de la tabla. Si aún no existen los datos, la tabla se deja con estructura y celdas `[EVIDENCIA PENDIENTE]` — nunca con cifras plausibles inventadas.
5. Lo mismo aplica a **figuras** (Figura 1, Figura 2, ...): numeración propia separada de las tablas, título, fuente, y referencia en el texto ("como se observa en la Figura 2...").

## Plantilla de redacción de la interpretación (mejora sobre "se observa que...")

Una interpretación completa toca, en este orden, y en 2-4 oraciones (no un párrafo largo):

1. **El dato más alto**: qué categoría/variable domina, con su cifra exacta. *"La categoría Medio concentra el 40.0% de los casos, la más frecuente."*
2. **El dato más bajo o el contraste**: qué categoría queda menos representada, o cómo se comparan dos grupos entre sí. *"En contraste, solo el 25.0% se ubica en el nivel Alto."*
3. **Una lectura del patrón** (no una opinión, una lectura de lo que dice el número): *"Esto sugiere que la mayoría de los estudiantes usa la aplicación de forma moderada, no intensiva."*
4. (Solo en tablas cruzadas/inferenciales) **Qué implica para la hipótesis o el objetivo** que esa tabla sustenta.

Evitar: repetir la tabla en prosa fila por fila; usar "se observa que", "se puede ver que", "podemos notar que" como única fórmula en todas las tablas del documento — variar la redacción (a modo de ejemplo: "los resultados indican...", "destaca que...", "la mayoría de los casos se concentra en...").

## Tipos de tabla que el arnés debe saber generar

| Tipo | Dónde va | Contenido |
|---|---|---|
| Operacionalización de variables | Metodología 3.2 (y anexo) | Variable, def. conceptual, def. operacional, dimensiones, indicadores, ítems, escala |
| Población / muestra | Metodología 3.3 | Composición (ej. por sexo, por grupo) y totales |
| Confiabilidad | Metodología 3.4 | Coeficiente (alfa de Cronbach) y N de elementos |
| Frecuencias | Resultados descriptivos | Categorías, frecuencia, %, % válido, % acumulado — una por variable y por dimensión |
| Tabla cruzada | Resultados descriptivos | Variable × variable o dimensión × variable, con recuentos y % |
| Prueba de normalidad | Resultados inferenciales | Estadístico, gl, sig. por variable/dimensión |
| Correlación / prueba de hipótesis | Resultados inferenciales | Coeficiente, sig., N — una por hipótesis |
| Comparativa | Marco teórico o Desarrollo | Comparación de enfoques/autores/casos con fuentes verificadas |
| Matriz de consistencia | Anexo 1 | Ver `matriz-de-consistencia.md` |

## Exportación

- Las tablas Markdown se convierten a tablas nativas de Word en la exportación a DOCX (vía Pandoc o equivalente) — no se exportan como imagen ni como texto preformateado, para que el alumno pueda seguir editándolas en Word.
- Tablas anchas (operacionalización, matriz de consistencia) se marcan para orientación horizontal o ajuste de tamaño en el acabado final en Word.
- El **índice de tablas** y el **índice de figuras** se regeneran desde las tablas/figuras que existen realmente en el documento, con su numeración y título exactos (ver skill `generar-indice-y-referencias`).
- En las presentaciones (HTML → PDF), las tablas grandes no se copian enteras: se extrae el dato clave o se convierte en un gráfico/tabla resumida de máximo 4-5 filas.
