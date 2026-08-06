# Herramientas del arnés (scripts deterministas)

**Regla central (regla 17 de `../../../AGENTS.md`): la IA nunca hace aritmética estadística "de cabeza".** Todo cálculo se ejecuta con estos scripts (o con SPSS/Jamovi del alumno) y se reporta la salida literal. Los scripts imprimen la fórmula con los valores sustituidos para que el alumno pueda explicar el cálculo en la sustentación.

Requisito: **Node.js** en el PATH de la terminal. La mayoría de los scripts no necesitan nada más (`lib-csv.js` y `lib-stats.js` son módulos propios, cero dependencias externas). Se eligió Node y no Python para no depender de si el alumno tiene Python instalado.

**Excepción (regla 30 de `../../../AGENTS.md`):** `descargar_fuente.js` (extracción de texto de PDF con `pdf-parse`) y `generar_slides_pptx.js` (generación de PowerPoint real con `pptxgenjs`) sí usan dos librerías npm maduras y de código abierto — se evaluaron primero alternativas propias y no había ganancia real en reinventarlas (ver el artefacto de auditoría comparativa de la v16). Antes de usarlos por primera vez en un proyecto, correr una vez en la raíz:

```
npm install
```

El resto del arnés sigue funcionando igual sin ese paso.

## Verificación previa obligatoria (regla 20 de `../../../AGENTS.md`)

**No se asume que `node` está disponible.** Que la app de escritorio (OpenCode Desktop, Claude Code, etc.) esté construida sobre cierto runtime no garantiza que ese runtime esté expuesto en el PATH de la terminal donde ella ejecuta comandos — son dos cosas distintas y no verificadas para cada app/versión.

Antes de correr cualquier script de esta carpeta, se corre primero:

```
node --version
```

- **Si responde una versión** (ej. `v20.11.0`): se procede normalmente.
- **Si falla** ("comando no encontrado" o similar): el arnés se detiene ahí, informa al alumno con instrucciones claras — instalar Node.js LTS desde nodejs.org (gratis, ~2 minutos, sin configuración adicional) y reiniciar la terminal — y **nunca** calcula el resultado "a mano" como solución de emergencia (violaría la regla 17: ningún cálculo estadístico se hace de memoria). Si el cálculo es urgente y no se puede instalar Node en el momento, la alternativa es SPSS/Jamovi/Excel para ese cálculo puntual, nunca la IA estimando.

Los ejemplos de esta página asumen que ya estás en esta carpeta (`node muestra.js ...`). Para correrlos desde la raíz del proyecto (donde vive `AGENTS.md`), antepón `nucleo/comun/herramientas/` — ver la tabla de `../../../ROUTING.md`, que ya trae cada comando listo con esa ruta.

## Cálculo

| Script | Qué calcula | Ejemplo |
|---|---|---|
| `muestra.js` | Tamaño de muestra, población finita/infinita | `node muestra.js --N 120` · `node muestra.js --infinita --e 0.03` |
| `validez-contenido.js` | V de Aiken (validez de contenido, juicio de expertos) desde el CSV real de calificaciones de jueces | `node validez-contenido.js juicio-expertos.csv` · `--categorias 5` · `--umbral 0.75` |
| `confiabilidad.js` | Alfa de Cronbach (escalas) / KR-20 (dicotómicos) + correlación ítem-total, IC 95% (bootstrap con semilla fija), alerta de redundancia (α > 0.95) y pares de ítems con r ≥ 0.90; con `--dimensiones D1,D1,D2,...` calcula el alfa por dimensión (obligatorio si la escala tiene más de una dimensión), desde el CSV del piloto | `node confiabilidad.js piloto.csv` · `--kr20` · `--dimensiones D1,D1,D2,D2` |
| `descriptivos.js` | Tablas de frecuencias y cruzadas (variables ya categorizadas) → **Markdown listo para pegar** | `node descriptivos.js datos.csv --frecuencia RS --orden Bajo,Medio,Alto` |
| `descriptivos-numericos.js` | Media, mediana, moda, DE, mín/máx de una variable numérica cruda (sin categorizar) | `node descriptivos-numericos.js datos.csv --columna Edad` |
| `correlacion.js` | Pearson / Spearman con p-valor bilateral (aprox. t) + **IC 95% del coeficiente (Fisher z)**, casos excluidos por faltantes reportados y reporte APA 7 sugerido con IC | `node correlacion.js datos.csv --x RS --y RA` |
| `chi-cuadrado.js` | Chi-cuadrado de independencia + V de Cramér sobre una tabla de contingencia | `node chi-cuadrado.js datos.csv --x RS_nivel --y RA_nivel` |
| `prueba-t.js` | t de Student (Welch, muestras independientes) + d de Cohen | `node prueba-t.js datos.csv --grupo Sexo --valor Puntaje` |
| `anova.js` | ANOVA de un factor (3+ grupos) + eta cuadrado | `node anova.js datos.csv --grupo Turno --valor Puntaje` |

Todos los scripts de esta sección aceptan `--salida <ruta>`: además de imprimir en terminal, escriben el mismo bloque de resultado a un archivo (típicamente en `output/trabajo/`) para copiarlo de ahí a `informe.md` — nunca retipeado de memoria de lo que se vio en la terminal (regla 29 de `../../../AGENTS.md`, fidelidad de datos).

Formato de los CSV: encabezado en la primera fila; cada fila un caso; separador coma; UTF-8. El parser (`lib-csv.js`) soporta campos entre comillas, pero no saltos de línea dentro de un campo.

## Verificación

| Script | Qué comprueba | Ejemplo |
|---|---|---|
| `verificar_citas.js` | Toda cita tiene referencia y viceversa; fuentes citadas están VERIFICADA; textuales con página | `node verificar_citas.js --informe output/trabajo/informe.md --investigacion fuentes/investigacion.md --salida output/trabajo/reporte-citas.md` |
| `verificar_estructura.js` | Numeración de tablas/figuras correlativa; menciones a Tabla/Figura/Anexo inexistentes; marcadores pendientes; secciones presentes | `node verificar_estructura.js --informe output/trabajo/informe.md --salida output/trabajo/reporte-estructura.md` |

## Búsqueda y exportación

| Script | Qué hace | Ejemplo |
|---|---|---|
| `buscar_fuentes.js` | Busca fuentes académicas reales en OpenAlex (250M+ trabajos, gratis, sin clave) — autor/año/DOI/revista reales + enlace directo al PDF de acceso abierto cuando existe | `node buscar_fuentes.js "procrastinacion academica" --desde 2020 --limite 10` |
| `verificar_doi.js` | Confirma que un DOI existe de verdad y trae sus metadatos reales desde CrossRef — chequeo de refuerzo antes de marcar una fuente `VERIFICADA` | `node verificar_doi.js 10.1234/ejemplo.2020.001` |
| `descargar_fuente.js` | Descarga una fuente (PDF/HTML) a disco. Si es PDF, extrae el texto real a un `.txt` hermano con `pdf-parse` — la lectura completa deja de depender de si la IA sabe abrir PDF nativamente | `node descargar_fuente.js <url> --salida fuentes/pdfs/nombre` |
| `generar_instrumento_html.js` | Genera una versión HTML imprimible del instrumento (`instrumento.md` → encuesta física con casillas), o con `--ficha-experto` la ficha de validación en blanco para jueces reales (ítems reales, columnas de Claridad/Relevancia/Pertinencia vacías — nunca genera calificaciones) | `node generar_instrumento_html.js output/trabajo/instrumento.md --salida output/entregables/instrumento.html --universidad "..." --carrera "..." --autor "..."` · `--ficha-experto` |
| `generar_slides_pptx.js` | Genera un `.pptx` real y editable desde la presentación HTML ya revisada, con `pptxgenjs` | `node generar_slides_pptx.js output/entregables/presentacion.html --salida output/entregables/presentacion.pptx` |
| `extraer_paginas_indice.js` | Calcula los números de página reales de cada título del índice leyendo el PDF maquetado (con `pdf-parse`) y escribe `output/trabajo/indice-paginas.json`, que el filtro `../exportacion/plantillas/indice-toc.lua` usa para poblar el campo de índice en la exportación (pipeline de doble pasada, ver `../exportacion/exportar-word.md`) | `node extraer_paginas_indice.js --informe output/trabajo/informe.md --pdf output/entregables/informe.pdf --salida output/trabajo/indice-paginas.json` |

`descargar_fuente.js` y `generar_instrumento_html.js` devuelven código de salida 1 si hay problemas (útil para la skill `auditar-tesis`).

## Inicialización del proyecto

| Script | Qué hace | Ejemplo |
|---|---|---|
| `inicializar_proyecto.js` | Crea (si faltan) `insumos/`, `fuentes/`, `fuentes/pdfs/`, `anexos/imagenes/`, `output/trabajo/`, `output/entregables/` — idempotente, no toca nada que ya exista | `node inicializar_proyecto.js` |

Se corre una sola vez al empezar un proyecto (ver "Primer paso, siempre" en `../../../AGENTS.md`), pero correrlo de más no hace daño.

## Límite honesto

- Los verificadores son deterministas pero no infalibles: detectan errores de correspondencia y formato mecánico; **no** pueden juzgar si una paráfrasis es fiel a su fuente ni si el formato fino APA de cada referencia (cursivas, DOI) es perfecto — eso queda en la revisión del alumno guiada por `../apa/`.
- `verificar_citas.js` puede dar un falso positivo cuando la preposición "de" precede a una cita narrativa por razones puramente gramaticales (ej. "consistente con el antecedente de Muñoz-Vargas et al. (2025)") — el script no puede distinguir esa "de" de un apellido real con partícula ("de la Cruz", "de Souza"), así que la trata como parte del apellido y no encuentra coincidencia. Es un caso genuinamente ambiguo en español: no se corrige con una regex más agresiva porque eso rompería la detección real de apellidos con partícula. Solución práctica: redactar la cita narrativa sin anteponer "de" ("consistente con lo reportado por Muñoz-Vargas et al. (2025)"), o revisar a mano ese aviso puntual en el reporte. **Este mismo riesgo aplica también al apellido con partícula EN MEDIO** ("Sandoval de Castilla", soportado desde v18): una frase genérica como "el estudio de Castilla (2020) demuestra..." es indistinguible en narrativa de un apellido real "Sandoval de Castilla (2020)" — mismo caso, misma causa raíz, misma solución práctica (revisar a mano ese aviso puntual si aparece).
- Para estadística que exige software especializado y **sigue derivada a SPSS/Jamovi a propósito**: pruebas de normalidad exactas (Shapiro-Wilk, Kolmogórov-Smirnov), pruebas basadas en rangos (Wilcoxon, U de Mann-Whitney, Kruskal-Wallis), t de Student pareada, comparaciones post-hoc de ANOVA (Tukey, Bonferroni), regresiones, **ANOVA factorial/MANOVA** (diseños con 2+ variables independientes cruzadas — ver `../formulas/elegir-diseno.md`), y **Análisis Factorial Exploratorio** (validez de constructo, opcional para diseños complejos — ver `../formulas/formulas-referencia.md`). La razón no es que sean "más difíciles" matemáticamente que lo que ya está en código — es que un error de implementación en una prueba basada en rangos, en una aproximación de normalidad o en una extracción factorial es mucho más difícil de detectar a simple vista que un error en un chi-cuadrado o una t; el costo de un bug silencioso ahí supera el beneficio de tenerlas en código propio. `../formulas/elegir-diseno.md` indica qué corresponde a cada diseño.
- Los scripts que sí calculan (`muestra.js`, `validez-contenido.js`, `confiabilidad.js`, `correlacion.js`, `chi-cuadrado.js`, `prueba-t.js`, `anova.js`, `descriptivos-numericos.js`) fueron probados contra ejemplos con resultado exactamente conocido: tamaño de muestra contra la fórmula clásica; V de Aiken verificado a mano (ítem con calificaciones [4,4,3]/[2,2,2]/[4,3,4] entre 3 jueces → V=0.889/0.333/0.889); alfa de Cronbach y correlación ítem-total verificados a mano (esta última también contrastada con un cálculo de Pearson independiente); Spearman/Pearson exactos en datos monotónicos; chi-cuadrado contra un ejemplo de manual (χ²=16.667, gl=1); t de Welch contra el dataset `sleep` de R (t=-1.861, gl=17.78, medias exactas); ANOVA contra el dataset `PlantGrowth` de R (F=4.846, p=0.0159, exacto); descriptivos numéricos contra un cálculo a mano. Los verificadores de citas/estructura se probaron contra un informe con errores sembrados y los detectaron todos. Ante cualquier discrepancia con SPSS, manda SPSS y se reporta la diferencia al docente.
- `buscar_fuentes.js` y `verificar_doi.js` (v16) se probaron contra la API real de OpenAlex/CrossRef con una búsqueda real ("procrastinación académica universitarios"): el DOI devuelto por OpenAlex se verificó de vuelta con `verificar_doi.js` contra CrossRef y los metadatos coincidieron exactamente. `descargar_fuente.js` con extracción de PDF se probó contra un PDF real de acceso abierto (21,363 caracteres extraídos correctamente). `generar_slides_pptx.js` se probó generando un `.pptx` de 7 diapositivas y confirmando visualmente (exportado a PDF/PNG con LibreOffice) que título, viñetas con negrita parcial, cifra destacada, callout y tabla con encabezado en negrita salen correctos, con los colores `--primario`/`--acento` de la plantilla.
- `extraer_paginas_indice.js` (v19) se probó de punta a punta con la tesis real de la prueba E2E: pipeline de doble pasada completo (pandoc → PDF de LibreOffice → extracción → pandoc de nuevo con el JSON) hasta convergencia, índice final de 41 entradas con números de página correctos en el PDF (38 páginas, sin páginas vacías) y en el XML del DOCX (placeholder ausente, tabulador con puntos líder presente, números enteros).
