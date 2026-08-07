# Routing del arnés

Este es el único archivo que se lee completo al empezar. Desde aquí se decide qué otro archivo abrir según la tarea — nunca se cargan todos los archivos del arnés de una vez.

Antes de esto, en un proyecto nuevo: `node nucleo/comun/herramientas/inicializar_proyecto.js` (ver "Primer paso, siempre" en `AGENTS.md`) — crea las carpetas de trabajo (`insumos/`, `fuentes/`, `output/...`) si aún no existen.

Enfoque actual del arnés: **tesis**. La carpeta `nucleo/informe/` reusa el contenido por sección de `nucleo/tesis/contenido/` (fuente única) con una tabla de omisiones propia (ver "Estado" al final).

## Reglas de comportamiento

Siempre, para cualquier tarea: `AGENTS.md` (raíz). Ahí están las 30 reglas no negociables (fuentes verificadas, no inventar, evidencia pendiente, no fabricar declaratorias/Turnitin, gate de instrumento/alfa, gate de datos principales, objetivos con opciones, dedicatoria preguntada, captura de insumos a disco, etc.) y el flujo completo paso a paso.

## Fuentes permitidas

`fuentes-permitidas.md` (raíz) — antes de investigar o citar cualquier cosa.

## Estructura general de la tesis (orden de secciones)

`nucleo/tesis/estructura-tesis-maestra.md` — solo cuando se necesita ver el documento completo o confirmar qué sección sigue. Para redactar una sección puntual, ir directo a su archivo en `nucleo/tesis/contenido/` (ver tabla abajo) — no hace falta abrir este archivo completo cada vez.

## Contenido por sección — tesis

No cargar todo `nucleo/tesis/contenido/`. Abrir solo el archivo que corresponde a la tarea actual:

| Si la tarea es... | Abrir |
|---|---|
| Analizar la rúbrica y preguntar los datos de autoría (autor, carrera, universidad, asesor) | `nucleo/skills/analizar-rubrica/SKILL.md` |
| Buscar fuentes (mínimo 15, ≤5 años, descargadas y leídas completas) | `nucleo/skills/investigar-fuentes/SKILL.md` |
| Definir/ajustar el título, verificar su disponibilidad, nombrar variables | `nucleo/tesis/contenido/titulo-y-variables.md` |
| Redactar objetivos (general y específicos, con opciones para elegir) | `nucleo/tesis/contenido/objetivos.md` |
| Redactar hipótesis (general y específicas, solo si el diseño las lleva) | `nucleo/tesis/contenido/hipotesis.md` |
| Crear/actualizar la matriz de consistencia (problema↔objetivo↔hipótesis↔variables↔metodología) | `nucleo/tesis/contenido/matriz-de-consistencia.md` |
| Redactar la Introducción | `nucleo/tesis/contenido/introduccion.md` |
| Redactar Antecedentes (marco teórico) | `nucleo/tesis/contenido/antecedentes.md` |
| Redactar Bases teóricas (marco teórico) | `nucleo/tesis/contenido/bases-teoricas.md` |
| Redactar Metodología (cualquier subsección: tipo/diseño, variables, población, procedimiento, análisis, aspectos éticos) | `nucleo/tesis/contenido/metodologia.md` |
| Calcular muestra (simple o estratificada), construir el instrumento, pilotear y validar con alfa de Cronbach (punto de control 3.4) | `nucleo/tesis/contenido/instrumento-y-muestra.md` |
| Decidir qué tipo de instrumento corresponde (encuesta, ficha de observación, lista de cotejo, ficha documental, guía de entrevista) | `nucleo/tesis/contenido/tipos-de-instrumento.md` |
| Recolectar y traer el dataset real de la muestra completa antes de Resultados (segundo punto de control) | `nucleo/tesis/contenido/recoleccion-datos-principal.md` |
| Generar cualquier tabla o figura (frecuencias, cruzadas, correlación, operacionalización, comparativas) | `nucleo/tesis/contenido/tablas-y-figuras.md` |
| Redactar Resultados (descriptivos o inferenciales) | `nucleo/tesis/contenido/resultados.md` |
| Redactar Discusión | `nucleo/tesis/contenido/discusion.md` |
| Redactar Conclusiones | `nucleo/tesis/contenido/conclusiones.md` |
| Redactar Recomendaciones | `nucleo/tesis/contenido/recomendaciones.md` |
| Redactar Resumen/Abstract y palabras clave | `nucleo/tesis/contenido/resumen-abstract.md` |
| Redactar Dedicatoria/Agradecimiento (preguntando a quién) | `nucleo/tesis/contenido/dedicatoria-agradecimiento.md` |
| Armar los Anexos | `nucleo/tesis/contenido/anexos.md` |

## Formato APA 7 (extraído de la guía oficial)

| Si la tarea es... | Abrir |
|---|---|
| Configurar formato del documento (márgenes, fuente, interlineado, niveles de título, portada) | `nucleo/comun/apa/formato-documento.md` |
| Escribir o revisar citas (narrativa/parentética, textuales, et al.) | `nucleo/comun/apa/citas.md` |
| Armar o revisar la lista de referencias | `nucleo/comun/apa/referencias.md` |
| Dar formato APA a tablas/figuras | `nucleo/comun/apa/tablas-figuras-apa.md` |

## Fórmulas y cálculos (regla 17: nunca calcular "de cabeza")

> Antes de correr cualquier script de esta sección: `node --version` primero (regla 20). Si falla, ver `nucleo/comun/herramientas/README.md` — nunca calcular a mano como solución de emergencia.

| Si la tarea es... | Abrir / correr |
|---|---|
| Decidir qué pruebas/fórmulas aplican al estudio | `nucleo/comun/formulas/elegir-diseno.md` |
| Escribir una fórmula en la Metodología o entenderla | `nucleo/comun/formulas/formulas-referencia.md` |
| Calcular tamaño de muestra (simple, estratificada, o modo interactivo) | `node nucleo/comun/herramientas/muestra.js --N ...` (agregar `--estratos "A:N,B:N"` o usar `--interactivo`) |
| Calcular alfa de Cronbach / KR-20 (agregar `--dimensiones D1,D1,D2,...` si la escala tiene más de una dimensión — obligatorio) | `node nucleo/comun/herramientas/confiabilidad.js piloto.csv` |
| Generar tablas de frecuencias/cruzadas (variables categorizadas) | `node nucleo/comun/herramientas/descriptivos.js datos.csv ...` |
| Descriptivos de una variable numérica cruda (media, mediana, moda, DE) | `node nucleo/comun/herramientas/descriptivos-numericos.js datos.csv --columna ...` |
| Calcular correlación Pearson/Spearman | `node nucleo/comun/herramientas/correlacion.js datos.csv --x ... --y ...` |
| Calcular chi-cuadrado de independencia + V de Cramér | `node nucleo/comun/herramientas/chi-cuadrado.js datos.csv --x ... --y ...` |
| Calcular t de Student (2 grupos independientes) + d de Cohen | `node nucleo/comun/herramientas/prueba-t.js datos.csv --grupo ... --valor ...` |
| Calcular ANOVA de un factor (3+ grupos) + eta cuadrado | `node nucleo/comun/herramientas/anova.js datos.csv --grupo ... --valor ...` |
| Descargar una fuente (PDF/HTML) para leerla completa antes de registrar sus datos | `node nucleo/comun/herramientas/descargar_fuente.js <url> --salida fuentes/pdfs/nombre` |
| Generar el instrumento en HTML imprimible para el piloto en papel | `node nucleo/comun/herramientas/generar_instrumento_html.js output/trabajo/instrumento.md --salida output/entregables/instrumento.html ...` |
| Ver todos los scripts y sus límites | `nucleo/comun/herramientas/README.md` |

## Verificación y auditoría (antes de exportar)

| Si la tarea es... | Abrir |
|---|---|
| Verificar citas (código + APA) | `nucleo/skills/verificar-citas/SKILL.md` |
| Verificar estructura y formato | `nucleo/skills/verificar-formato/SKILL.md` |
| Auditoría integral pre-exportación | `nucleo/skills/auditar-tesis/SKILL.md` |
| Calcular muestra + construir instrumento + gate de alfa de Cronbach | `nucleo/skills/construir-instrumento/SKILL.md` |
| Exigir el dataset real de la muestra completa antes de Resultados (segundo gate) | `nucleo/skills/recolectar-datos-principales/SKILL.md` |
| Redactar objetivos con opciones | `nucleo/skills/definir-objetivos/SKILL.md` |
| Redactar Dedicatoria/Agradecimiento preguntando a quién | `nucleo/skills/redactar-preliminares/SKILL.md` |

## Exportación

| Si la tarea es... | Abrir |
|---|---|
| Exportar a Word (Pandoc + plantilla APA + numeración romana/arábiga) | `nucleo/comun/exportacion/exportar-word.md` |
| Exportar a PDF y verificarlo | `nucleo/comun/exportacion/exportar-pdf.md` |
| Crear la presentación de sustentación (HTML → PDF) | `nucleo/comun/exportacion/slides-html.md` y `nucleo/comun/exportacion/plantillas/slides-base.html` |

## Compatibilidad multi-herramienta

El arnés funciona en OpenCode (lee `AGENTS.md` nativo), Codex (también `AGENTS.md`) y Claude Code (entra por `CLAUDE.md`, que apunta aquí) — y en cualquier otro agente que pueda leer y seguir instrucciones en Markdown. Deliberadamente **no** hay carpetas propietarias (`.opencode/`, `.claude/`, `.codex/`): las skills viven en una sola carpeta neutra, `nucleo/skills/`, y se abren siguiendo esta tabla, no por un mecanismo de auto-descubrimiento de una herramienta específica.

## Informe (no-tesis)

`nucleo/informe/estructura-informe-maestra.md` — versión reducida de la tesis. El contenido detallado de cada sección sigue viniendo de `nucleo/tesis/contenido/` (fuente única); qué omitir o fusionar de cada archivo está explícito, archivo por archivo, en `nucleo/informe/contenido/omisiones.md` — no a criterio libre del agente.

## Skills

`nucleo/skills/README.md` — tabla de las 17 skills y qué cubre cada una. Abrir la skill puntual (`nucleo/skills/<nombre>/SKILL.md`) solo cuando se va a ejecutar ese paso.

## Cómo retomar una sesión

El arnés no tiene memoria propia entre sesiones — cada conversación nueva (aunque sea otra herramienta: OpenCode hoy, Claude Code mañana) empieza sin saber nada de la anterior. Esto es normal y esperado porque la tesis tiene **dos puntos donde el trabajo se pausa a esperar datos reales** que solo el alumno puede traer (el piloto y la recolección principal), y eso puede tardar días o semanas. La fuente de verdad siempre son los archivos del proyecto, nunca la conversación — por eso, al empezar cualquier sesión sobre un proyecto ya iniciado, antes de redactar nada:

1. Leer `insumos/` — ¿hay algo que el alumno compartió en una sesión anterior y que ya está guardado ahí (regla 27)? Si algo se mencionó en el chat pero no se ve un archivo correspondiente, no se asuma perdido sin más: se le pregunta al alumno y se guarda en ese mismo turno.
2. Leer `output/trabajo/brief.md` (¿ya está confirmado?).
3. Leer `output/trabajo/informe.md` completo: ¿dónde se detiene el contenido real? ¿qué `[EVIDENCIA PENDIENTE]` o `[PENDIENTE: ...]` quedan? Si el documento ya es extenso (varias decenas de páginas — tesis avanzada), no hace falta releer todo carácter por carácter en cada turno posterior de la misma sesión: releer la sección específica que se va a tocar (por título/número), y solo el documento completo al empezar la sesión, para no gastar contexto de más en secciones que no van a cambiar.
3.1. **Si el contenido de una sección no coincide con lo que el arnés generó la última vez** (aparece texto, una cifra o un párrafo que no sigue el estilo/estructura que el propio arnés habría escrito) — es indicio de que el alumno editó `informe.md` a mano fuera de la conversación. No sobrescribir esa sección en silencio: decírselo al alumno ("veo un cambio en esta sección que no reconozco de la última sesión, ¿lo hiciste tú? ¿lo mantengo o lo reemplazo?") antes de aplicar cualquier edición ahí. El arnés no tiene control de versiones — esta pregunta es la única red de seguridad contra perder una edición manual real.
4. Revisar si existen `output/trabajo/piloto.csv` y `output/trabajo/datos-principales.csv` — su sola presencia (o ausencia) dice en qué punto de control está el alumno:

| Situación | Qué significa | Dónde retomar |
|---|---|---|
| Metodología 3.4 sin alfa real registrado | Gate 1 no superado | `construir-instrumento` — no redactar nada más allá de 3.4 |
| 3.4 con alfa ≥ 0.70 pero sin `output/trabajo/datos-principales.csv` | Gate 1 superado, gate 2 pendiente | `recolectar-datos-principales` — no redactar Resultados con datos de relleno |
| `output/trabajo/datos-principales.csv` presente | Ambos gates superados | Seguir con Resultados en adelante, según dónde se haya quedado `informe.md` |

Esto no es un mecanismo nuevo, solo lo hace explícito: es el mismo principio que ya rige todo el arnés (regla 6, 8, 21/26 y 27 de `AGENTS.md`) — los archivos son la fuente de verdad, nunca la conversación. Verificar esto primero evita tres errores: re-preguntar algo que el alumno ya resolvió en otra sesión, saltarse un gate porque la conversación "no se acuerda" de que estaba pendiente, o perder un insumo que el alumno compartió y que nunca se guardó en disco.

## Estado de este arnés

- **Versión activa: v21.** Completo y validado contra tesis reales: estructura, contenido por sección, fuentes, reglas, APA 7 (de la guía oficial), fórmulas por diseño, scripts probados con datos conocidos, pipeline de exportación verificado (incluye índice de contenidos real poblado por el arnés — `indice-toc.lua` + `extraer_paginas_indice.js`, ver `nucleo/comun/exportacion/exportar-word.md`) y prueba E2E de punta a punta con los 4 entregables reales (DOCX, PDF, slides HTML y PDF de sustentación).
- Modo informe disponible desde v17: `nucleo/informe/contenido/omisiones.md` define archivo por archivo qué omitir o fusionar de `nucleo/tesis/contenido/` — el modo informe ya no depende de que el agente decida en vivo.
- Desde v21, dos límites estructurales de la IA se resuelven con verificación humana obligatoria (no con "mejor prompt"): detectar correlaciones espurias/confusores (checklist de 3 preguntas en `discusion.md`) y confirmar que un parafraseo no distorsione el significado técnico de la fuente (`originalidad-y-similitud.md` / `citas.md`, regla 5).
- Chequeos humanos que siguen vigentes (el arnés no puede verificarlos por código): revisión visual final en Word real — punto 12 de `auditar-tesis`, `[PENDIENTE: REVISIÓN EN WORD REAL]` — y `node --version` en una instalación limpia de alumno (smoke test del día 1, ver "Primer paso, siempre" en `AGENTS.md`).
- Historial completo de versiones v3-v21 (cada prueba E2E, bug corregido y decisión documentada): `CHANGELOG.md`.

