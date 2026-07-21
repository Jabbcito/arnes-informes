---
tema: Exportar informe.md a Word (DOCX) con estructura de tesis y estilos APA
---

# Exportar a Word

## Requisito: Pandoc

Instalar una sola vez: `winget install --id JohnMacFarlane.Pandoc` (Windows) — o descargar de pandoc.org. Verificar con `pandoc --version`.

## Comando base

```bash
cd mi-tesis
pandoc trabajo/informe.md \
  --from markdown+raw_attribute \
  --reference-doc=plantillas/plantilla-apa.docx \
  --toc --toc-depth=3 \
  --resource-path=.:anexos/imagenes \
  -o entregables/informe.docx
```

- `--from markdown+raw_attribute` habilita los saltos de página reales (ver más abajo) — sin esta extensión, el marcador de salto de página se ignora.
- `--reference-doc` aplica los ESTILOS de la plantilla (no su contenido).
- `--toc` genera el índice de contenidos como campo de Word (se actualiza con F9 / clic derecho → Actualizar campos). **Esto ya es un índice funcional, no una lista de texto.**
- `--resource-path` permite que las imágenes de anexos se incrusten.
- Las tablas Markdown se convierten en **tablas nativas de Word editables** — nunca imágenes.

## Saltos de página reales (verificado)

Word/APA exige que varias secciones preliminares empiecen en su propia página: Declaratoria de autenticidad del asesor, Declaratoria de originalidad de los autores, Dedicatoria, Agradecimiento, Resumen, Abstract (la guía APA real dice explícitamente "comience el resumen en una nueva página"). Para forzar el salto en la exportación, se inserta este bloque al final de cada una de esas secciones en `trabajo/informe.md`:

```
```{=openxml}
<w:p><w:r><w:br w:type="page"/></w:r></w:p>
```
```

**Verificado:** un documento de prueba con este marcador entre 3 secciones exportó y convirtió a PDF con exactamente 3 páginas separadas (una por sección). Requiere que el comando de Pandoc use `--from markdown+raw_attribute` (arriba) — sin esa extensión, Pandoc trata el bloque como texto literal y no genera el salto.

La skill que arma cada preliminar (`redactar-preliminares`, `generar-indice-y-referencias`, etc.) inserta este marcador automáticamente al cerrar cada sección — el alumno no necesita escribirlo a mano.

## Referencias con sangría francesa real

Escribir la lista de referencias envuelta en un bloque de estilo nativo de Pandoc, así:

```markdown
::: {custom-style="Bibliography"}
Carrillo, M. (2020). *Rendimiento académico y factores asociados*. Revista Educativa.

Hinojo, F. (2019). *Redes sociales en la educación superior*. Editorial Universitaria.
:::
```

**Verificado:** cada párrafo dentro del bloque queda con el estilo de párrafo "Bibliography" de `plantillas/plantilla-apa.docx` (sangría francesa de 1.27 cm ya configurada en esa plantilla), y las cursivas de los títulos (marcadas con `*texto*` en el Markdown) se conservan correctamente como texto en cursiva real dentro del DOCX.

- El título **"Referencias"** (el encabezado de la sección, no el bloque de arriba) va en **negrita**, centrado — es lo único en negrita en toda la sección; APA 7 real NO pone en negrita las entradas individuales.
- Los títulos de libro/artículo dentro de cada entrada van en cursiva (ya se ve reflejado con `*texto*` en las plantillas de `../apa/referencias.md`).

## Tablas y figuras con caption nativo (necesario para el índice de tablas/figuras)

En vez de escribir "**Tabla N**" como texto suelto antes de la tabla, se usa la sintaxis de caption nativa de Pandoc, **debajo** de la tabla:

```markdown
| Nivel | f |
|---|---|
| Bajo | 3 |
| Alto | 7 |

Table: **Tabla 2.** *Frecuencias de prueba*
```

Para figuras, el texto alternativo de la imagen es el caption:

```markdown
![**Figura 1.** Diagrama de flujo del proceso](anexos/imagenes/figura-01.png)
```

**Verificado:** Pandoc asigna un estilo de párrafo distintivo a cada caption (`TableCaption` para tablas, `ImageCaption` para figuras) y conserva la negrita/cursiva del texto. **No numera automáticamente** ("Tabla 2." se escribe a mano, igual que antes) — el número lo controla y verifica `comun/herramientas/verificar_estructura.js`, igual que en el resto del arnés.

### Índice de tablas y de figuras (paso manual en Word, una vez)

Como Pandoc no inserta un campo `SEQ` automático (los números de tabla/figura son texto, no un contador de Word), el índice se arma desde el **estilo** del caption, no desde "etiqueta de título":

1. Word → **Referencias** → **Insertar tabla de ilustraciones**.
2. **Opciones** → desmarcar "Etiqueta de título" → marcar **"Estilo"** → elegir `TableCaption` (para el índice de tablas) o `ImageCaption` (para el índice de figuras).
3. Repetir una vez para tablas y otra para figuras (dos índices separados).
4. Se actualiza igual que el índice de contenidos: clic derecho → Actualizar campo.

> Aclaración para el alumno: el índice de contenidos SÍ lo exige el formato de tesis universitaria (no es una regla de APA en sí — APA no pide "tabla de contenido" para artículos). El índice de tablas/figuras es igual: requisito de la universidad, no de APA. Por eso Pandoc no lo genera solo — es un paso de Word.

## La plantilla `plantillas/plantilla-apa.docx`

Ya viene pre-configurada en el arnés (verificado por código): Times New Roman 12, interlineado doble, sangría de primera línea 1.27 cm en el cuerpo, Título 1 centrado, y sangría francesa en el estilo Bibliography.

Ajustes finos que se hacen UNA vez en Word si la universidad lo exige (modificar ESTILOS, no texto):

- **Título 1**: pasarlo a MAYÚSCULAS si el formato es el peruano observado ("I. INTRODUCCIÓN"); APA puro usa Mayúsculas Y Minúsculas.
- **Título 2 y 3**: verificar contra los niveles APA (`../apa/formato-documento.md`).
- **Estilo de tabla** por defecto: solo bordes horizontales (arriba, abajo, bajo encabezado).
- Márgenes: verificar 2.54 cm en los 4 lados.

Guardar y reutilizar: todos los proyectos del curso usan esta misma plantilla.

## Numeración romana (preliminares) + arábiga (cuerpo)

Pandoc no crea los saltos de sección con numeración distinta — ese acabado se hace **una vez en Word**, al final:

1. Colocar el cursor al inicio de "I. INTRODUCCIÓN" → Disposición → Saltos → Salto de sección (página siguiente).
2. En el pie/encabezado de la sección 2: desvincular "Vincular al anterior" → Número de página → Formato: 1, 2, 3 → Iniciar en 1.
3. En la sección 1 (preliminares): Formato: i, ii, iii.
4. Actualizar el índice (F9) para que tome la numeración real.

La numeración de página va en la **esquina superior derecha**, en todas las páginas incluida la carátula (que es la página 1) — así lo dice la guía APA 7 real.

Este paso es parte del "acabado final en Word" del flujo (Markdown = fuente maestra; Word = acabado), y se enseña una sola vez en la Sesión 2.

## Verificación post-export (obligatoria)

- [ ] El DOCX abre sin errores y con la fuente/interlineado correctos.
- [ ] Índice de contenidos actualizado (F9) y coincide con los títulos reales.
- [ ] Índice de tablas e índice de figuras insertados (Referencias → Insertar tabla de ilustraciones → Estilo) y actualizados.
- [ ] Declaratorias, Dedicatoria, Agradecimiento, Resumen y Abstract están cada uno en su propia página.
- [ ] Tablas: nativas y editables, con el estilo de bordes correcto; las anchas en página horizontal (Disposición → Orientación, solo esa sección).
- [ ] Imágenes de anexos incrustadas y legibles.
- [ ] Numeración romana/arábiga correcta tras los saltos de sección, en la esquina superior derecha.
- [ ] Referencias con sangría francesa real (estilo Bibliography aplicado, no solo descrito).
- [ ] Sin marcadores `[EVIDENCIA PENDIENTE]` ni `[PENDIENTE: A QUIÉN VA LA DEDICATORIA/EL AGRADECIMIENTO]` (la auditoría previa ya debió garantizarlo).
