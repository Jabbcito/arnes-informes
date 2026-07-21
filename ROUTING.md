# Routing del arnés

Este es el único archivo que se lee completo al empezar. Desde aquí se decide qué otro archivo abrir según la tarea — nunca se cargan todos los archivos del arnés de una vez.

Enfoque actual del arnés: **tesis**. La carpeta `informe/` existe pero solo tiene la estructura reducida; no se ha desarrollado contenido por sección todavía (ver "Estado" al final).

## Reglas de comportamiento

Siempre, para cualquier tarea: `AGENTS.md` (raíz). Ahí están las 26 reglas no negociables (fuentes verificadas, no inventar, evidencia pendiente, no fabricar declaratorias/Turnitin, gate de instrumento/alfa, gate de datos principales, objetivos con opciones, dedicatoria preguntada, etc.) y el flujo completo paso a paso.

## Fuentes permitidas

`fuentes-permitidas.md` (raíz) — antes de investigar o citar cualquier cosa.

## Estructura general de la tesis (orden de secciones)

`tesis/estructura-tesis-maestra.md` — solo cuando se necesita ver el documento completo o confirmar qué sección sigue. Para redactar una sección puntual, ir directo a su archivo en `tesis/contenido/` (ver tabla abajo) — no hace falta abrir este archivo completo cada vez.

## Contenido por sección — tesis

No cargar todo `tesis/contenido/`. Abrir solo el archivo que corresponde a la tarea actual:

| Si la tarea es... | Abrir |
|---|---|
| Definir/ajustar el título, verificar su disponibilidad, nombrar variables | `tesis/contenido/titulo-y-variables.md` |
| Redactar objetivos (general y específicos, con opciones para elegir) | `tesis/contenido/objetivos.md` |
| Crear/actualizar la matriz de consistencia (problema↔objetivo↔hipótesis↔variables↔metodología) | `tesis/contenido/matriz-de-consistencia.md` |
| Redactar la Introducción | `tesis/contenido/introduccion.md` |
| Redactar Antecedentes (marco teórico) | `tesis/contenido/antecedentes.md` |
| Redactar Bases teóricas (marco teórico) | `tesis/contenido/bases-teoricas.md` |
| Redactar Metodología (cualquier subsección: tipo/diseño, variables, población, procedimiento, análisis, aspectos éticos) | `tesis/contenido/metodologia.md` |
| Calcular muestra (simple o estratificada), construir el instrumento, pilotear y validar con alfa de Cronbach (punto de control 3.4) | `tesis/contenido/instrumento-y-muestra.md` |
| Decidir qué tipo de instrumento corresponde (encuesta, ficha de observación, lista de cotejo, ficha documental, guía de entrevista) | `tesis/contenido/tipos-de-instrumento.md` |
| Recolectar y traer el dataset real de la muestra completa antes de Resultados (segundo punto de control) | `tesis/contenido/recoleccion-datos-principal.md` |
| Generar cualquier tabla o figura (frecuencias, cruzadas, correlación, operacionalización, comparativas) | `tesis/contenido/tablas-y-figuras.md` |
| Redactar Resultados (descriptivos o inferenciales) | `tesis/contenido/resultados.md` |
| Redactar Discusión | `tesis/contenido/discusion.md` |
| Redactar Conclusiones | `tesis/contenido/conclusiones.md` |
| Redactar Recomendaciones | `tesis/contenido/recomendaciones.md` |
| Redactar Resumen/Abstract y palabras clave | `tesis/contenido/resumen-abstract.md` |
| Redactar Dedicatoria/Agradecimiento (preguntando a quién) | `tesis/contenido/dedicatoria-agradecimiento.md` |
| Armar los Anexos | `tesis/contenido/anexos.md` |

## Formato APA 7 (extraído de la guía oficial)

| Si la tarea es... | Abrir |
|---|---|
| Configurar formato del documento (márgenes, fuente, interlineado, niveles de título, portada) | `comun/apa/formato-documento.md` |
| Escribir o revisar citas (narrativa/parentética, textuales, et al.) | `comun/apa/citas.md` |
| Armar o revisar la lista de referencias | `comun/apa/referencias.md` |
| Dar formato APA a tablas/figuras | `comun/apa/tablas-figuras-apa.md` |

## Fórmulas y cálculos (regla 17: nunca calcular "de cabeza")

> Antes de correr cualquier script de esta sección: `node --version` primero (regla 20). Si falla, ver `comun/herramientas/README.md` — nunca calcular a mano como solución de emergencia.

| Si la tarea es... | Abrir / correr |
|---|---|
| Decidir qué pruebas/fórmulas aplican al estudio | `comun/formulas/elegir-diseno.md` |
| Escribir una fórmula en la Metodología o entenderla | `comun/formulas/formulas-referencia.md` |
| Calcular tamaño de muestra (simple, estratificada, o modo interactivo) | `node comun/herramientas/muestra.js --N ...` (agregar `--estratos "A:N,B:N"` o usar `--interactivo`) |
| Calcular alfa de Cronbach / KR-20 | `node comun/herramientas/confiabilidad.js piloto.csv` |
| Generar tablas de frecuencias/cruzadas (Markdown listo) | `node comun/herramientas/descriptivos.js datos.csv ...` |
| Calcular correlación Pearson/Spearman | `node comun/herramientas/correlacion.js datos.csv --x ... --y ...` |
| Ver todos los scripts y sus límites | `comun/herramientas/README.md` |

## Verificación y auditoría (antes de exportar)

| Si la tarea es... | Abrir |
|---|---|
| Verificar citas (código + APA) | `skills/verificar-citas/SKILL.md` |
| Verificar estructura y formato | `skills/verificar-formato/SKILL.md` |
| Auditoría integral pre-exportación | `skills/auditar-tesis/SKILL.md` |
| Calcular muestra + construir instrumento + gate de alfa de Cronbach | `skills/construir-instrumento/SKILL.md` |
| Exigir el dataset real de la muestra completa antes de Resultados (segundo gate) | `skills/recolectar-datos-principales/SKILL.md` |
| Redactar objetivos con opciones | `skills/definir-objetivos/SKILL.md` |
| Redactar Dedicatoria/Agradecimiento preguntando a quién | `skills/redactar-preliminares/SKILL.md` |

## Exportación

| Si la tarea es... | Abrir |
|---|---|
| Exportar a Word (Pandoc + plantilla APA + numeración romana/arábiga) | `comun/exportacion/exportar-word.md` |
| Exportar a PDF y verificarlo | `comun/exportacion/exportar-pdf.md` |
| Crear la presentación de sustentación (HTML → PDF) | `comun/exportacion/slides-html.md` y `comun/exportacion/plantillas/slides-base.html` |

## Compatibilidad multi-herramienta

El arnés funciona en OpenCode (lee `AGENTS.md` nativo), Codex (también `AGENTS.md`) y Claude Code (entra por `CLAUDE.md`, que apunta aquí) — y en cualquier otro agente que pueda leer y seguir instrucciones en Markdown. Deliberadamente **no** hay carpetas propietarias (`.opencode/`, `.claude/`, `.codex/`): las skills viven en una sola carpeta neutra, `skills/`, y se abren siguiendo esta tabla, no por un mecanismo de auto-descubrimiento de una herramienta específica.

## Informe (no-tesis)

`informe/estructura-informe-maestra.md` — versión reducida de la tesis. Todavía no tiene `contenido/` propio; mientras no exista, usar los archivos de `tesis/contenido/` que apliquen y omitir lo que la estructura reducida ya descarta (ver esa misma nota al final de `informe/estructura-informe-maestra.md`).

## Skills

`skills/README.md` — tabla de las 17 skills y qué cubre cada una. Abrir la skill puntual (`skills/<nombre>/SKILL.md`) solo cuando se va a ejecutar ese paso.

## Cómo retomar una sesión

El arnés no tiene memoria propia entre sesiones — cada conversación nueva (aunque sea otra herramienta: OpenCode hoy, Claude Code mañana) empieza sin saber nada de la anterior. Esto es normal y esperado porque la tesis tiene **dos puntos donde el trabajo se pausa a esperar datos reales** que solo el alumno puede traer (el piloto y la recolección principal), y eso puede tardar días o semanas. La fuente de verdad siempre son los archivos del proyecto, nunca la conversación — por eso, al empezar cualquier sesión sobre un proyecto ya iniciado, antes de redactar nada:

1. Leer `trabajo/brief.md` (¿ya está confirmado?).
2. Leer `trabajo/informe.md` completo: ¿dónde se detiene el contenido real? ¿qué `[EVIDENCIA PENDIENTE]` o `[PENDIENTE: ...]` quedan?
3. Revisar si existen `trabajo/piloto.csv` y `trabajo/datos-principales.csv` — su sola presencia (o ausencia) dice en qué punto de control está el alumno:

| Situación | Qué significa | Dónde retomar |
|---|---|---|
| Metodología 3.4 sin alfa real registrado | Gate 1 no superado | `construir-instrumento` — no redactar nada más allá de 3.4 |
| 3.4 con alfa ≥ 0.70 pero sin `trabajo/datos-principales.csv` | Gate 1 superado, gate 2 pendiente | `recolectar-datos-principales` — no redactar Resultados con datos de relleno |
| `trabajo/datos-principales.csv` presente | Ambos gates superados | Seguir con Resultados en adelante, según dónde se haya quedado `informe.md` |

Esto no es un mecanismo nuevo, solo lo hace explícito: es el mismo principio que ya rige todo el arnés (regla 6, 8 y 21/26 de `AGENTS.md`) — los archivos son la fuente de verdad. Verificar esto primero evita dos errores: re-preguntar algo que el alumno ya resolvió en otra sesión, o saltarse un gate porque la conversación "no se acuerda" de que estaba pendiente.

## Estado de este arnés

- Completo y validado contra tesis reales: estructura, contenido por sección, fuentes, reglas, APA 7 (de la guía oficial), fórmulas por diseño, scripts probados con datos conocidos y pipeline de exportación verificado (Pandoc: tablas nativas + imágenes incrustadas + TOC).
- Pendiente: `informe/contenido/` (versión reducida por sección, aún no dividida como la de tesis).
- Verificado contra la documentación oficial (opencode.ai/docs/skills/): OpenCode carga skills desde `skills/<nombre>/SKILL.md` (una carpeta por skill), con frontmatter `name` (debe coincidir con el nombre de la carpeta, patrón `^[a-z0-9]+(-[a-z0-9]+)*$`) y `description`. Las 13 skills del arnés ya están reestructuradas así y sus nombres validados contra el patrón.
- Verificado con impresión real (Edge headless `--print-to-pdf`, equivalente a Ctrl+P → Guardar como PDF): `comun/exportacion/plantillas/slides-base.html` produce un PDF de 7 páginas, cada una 960×540pt (16:9 exacto, sin cortes ni páginas extra), con texto, acentos y color del título correctos. Pendiente solo un vistazo visual fino (franja de color, sombreados) en un visor de PDF completo — no se pudo confirmar al 100% por límites de la herramienta de captura usada aquí.
- Verificado con LibreOffice (abre y exporta DOCX de Pandoc sin errores): un documento con salto de sección y numeración diferenciada (`../herramientas/`-independiente; ver `comun/exportacion/exportar-word.md`) exporta a PDF con la página de preliminares mostrando "i" y la primera página del cuerpo mostrando "1" — el mecanismo funciona. Pendiente: reproducir el mismo paso con Word real (esta máquina no lo tiene) para confirmar que el flujo manual en la interfaz de Word coincide.
- Pendiente de verificar: si `node` queda expuesto en el PATH de la terminal en las versiones de escritorio de OpenCode/Claude Code/Codex (probado solo en máquina de desarrollo con Node ya instalado, no en una instalación limpia de alumno). El chequeo `node --version` (regla 20) hace que esto falle de forma clara y con instrucciones en vez de romperse en silencio, pero no reemplaza la prueba real en una PC nueva.
- **Probado de punta a punta con una tesis sintética completa** (título → matriz de consistencia → fuentes marcadas `[EVIDENCIA PENDIENTE]`, sin fabricar citas reales → metodología con `comun/herramientas/muestra.js`/`comun/herramientas/confiabilidad.js` sobre datos simulados n=60/piloto n=15 → resultados con `comun/herramientas/descriptivos.js`/`comun/herramientas/correlacion.js` → discusión → auditoría con `comun/herramientas/verificar_citas.js`/`comun/herramientas/verificar_estructura.js` en verde → exportación real a DOCX vía Pandoc + `comun/exportacion/plantillas/plantilla-apa.docx` (3 tablas nativas, imagen de anexo incrustada, índice como campo, estilos aplicados) → PDF vía LibreOffice (8 páginas, contenido íntegro) → slides HTML rellenadas con el mismo contenido → PDF de sustentación (7 páginas, 16:9 exacto)). **Esta prueba encontró y corrigió un bug real**: `comun/herramientas/verificar_citas.js` no detectaba apellidos españoles con partícula ("de la Cruz", "Del Pozo") — corregido y re-verificado sin regresión contra el caso de prueba original. Limitación documentada que se dejó tal cual (no se intentó arreglar por el riesgo de falsos positivos): apellidos compuestos SIN partícula ("Vargas Llosa") solo se detectan por su primer término.
- No verificado visualmente (limitación de la herramienta de captura, no evidencia de fallo): cómo se ve exactamente una tabla larga partida en un salto de página del PDF exportado. Es estructuralmente una tabla OOXML única con fila de encabezado repetida — comportamiento que la guía APA real recomienda explícitamente — pero no se confirmó con una captura visual.
- **v3 — verificado por código**: los saltos de página reales entre preliminares (Declaratorias, Dedicatoria, Agradecimiento, Resumen, Abstract) funcionan con `pandoc --from markdown+raw_attribute` + bloque ```` ```{=openxml}<w:p><w:r><w:br w:type="page"/></w:r></w:p>``` ```` — probado con 3 secciones → 3 páginas reales en el PDF (LibreOffice). Las Referencias envueltas en `::: {custom-style="Bibliography"} :::` sí aplican el estilo con sangría francesa real (confirmado por XML) y conservan la cursiva de los títulos. El caption nativo de Pandoc para tablas (`Table: **Tabla N.** *Título*`) y figuras (`![**Figura N.** Título](ruta)`) conserva negrita/cursiva y genera estilos distintivos (`TableCaption`/`ImageCaption`) que permiten un índice de tablas/figuras real en Word (Referencias → Insertar tabla de ilustraciones → Estilo) — sin numeración automática (se escribe a mano, igual que siempre).
- **v3 — nuevo punto de control**: no se redacta más allá de Metodología 3.4 sin muestra calculada + instrumento construido + piloto real + alfa de Cronbach ≥ 0.70 (`tesis/contenido/instrumento-y-muestra.md`, skill `construir-instrumento`). Los objetivos ahora se presentan como opciones (skill `definir-objetivos`) y la Dedicatoria/Agradecimiento preguntan a quién van dirigidos (skill `redactar-preliminares`) — estas 3 son reglas de comportamiento del agente, no verificables por script; la verificación es de que el texto de la instrucción sea claro y esté en el lugar correcto del flujo.
- **v4 — verificado por código**: `comun/herramientas/muestra.js` ahora soporta muestreo estratificado (`--estratos "A:N,B:N,..."`, afijación proporcional, probado a mano contra N=120 en 3 estratos: n=92 repartido en 31/27/34, suma exacta) y modo `--interactivo` (probado con entradas simuladas por stdin, produce el mismo resultado que el modo por flags). El modo interactivo usa un lector de líneas propio en vez de `readline.question()` encadenado porque ese patrón pierde preguntas cuando stdin no es una terminal interactiva (bug real encontrado durante la prueba, corregido y verificado sin regresión).
- **v4 — segundo punto de control**: no se redacta Resultados, Discusión, Conclusiones ni Recomendaciones sin `trabajo/datos-principales.csv` real — el dataset de aplicar el instrumento ya validado a toda la muestra, nunca el CSV del piloto (`tesis/contenido/recoleccion-datos-principal.md`, skill `recolectar-datos-principales`, regla 26). Igual que el gate del piloto, es una regla de comportamiento del agente, no verificable por script.
- **v4 — objetivos en dos etapas**: la skill `definir-objetivos` ya no genera general y específicos juntos; espera a que el alumno confirme el general antes de generar los específicos, y estos quedan ligados a las variables/dimensiones del general elegido (no a una lista genérica). Ver `tesis/contenido/objetivos.md`.
- **v4 — tipo de instrumento antes del formulario**: `construir-instrumento` ya no asume "encuesta Likert" por defecto — primero determina (o pregunta) qué tipo de instrumento corresponde al diseño declarado (encuesta, prueba, ficha de observación, lista de cotejo, ficha documental, guía de entrevista/focus group), cada uno con su propia escala y su propio coeficiente de confiabilidad (o ninguno, en documental/cualitativo). Ver `tesis/contenido/tipos-de-instrumento.md`.
