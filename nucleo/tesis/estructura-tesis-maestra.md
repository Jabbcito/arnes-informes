# Estructura maestra de tesis

Basada en el análisis de 5 tesis reales de repositorios universitarios peruanos (UCV x3, UPAO, UNMSM). Cuatro de las cinco (las de diseño cuantitativo/aplicado) comparten casi la misma estructura — es el estándar que sigue este arnés. La de UNMSM (maestría en escritura creativa, estructura por capítulos temáticos) es un caso atípico de tesis humanística; se documenta aparte como referencia, no como base.

Esta es la plantilla más completa del sistema. `../informe/estructura-informe-maestra.md` es una versión reducida de esta misma estructura para trabajos que no son tesis (informes, monografías, ensayos).

---

## Preliminares

1. **Carátula/Portada** — universidad, facultad, escuela profesional/programa, título de la tesis, "Tesis para obtener el título/grado de...", autor(es), asesor(es), línea de investigación, línea de responsabilidad social universitaria (si aplica), ciudad y año. Variante observada (UPAO): incluye además el **jurado evaluador** (presidente, secretario, vocal) y sub-línea de investigación — se pregunta al alumno qué formato exige su universidad. El título debe haber pasado el protocolo de verificación de disponibilidad (`contenido/titulo-y-variables.md`) antes de fijarse aquí.
2. **Declaratoria de autenticidad del asesor** — firmada por el asesor, incluye el % de índice de similitud del reporte de Turnitin y la fecha en que se corrió. **El arnés no genera ni completa esta sección: es un documento que el asesor firma después de correr Turnitin sobre el documento real. El arnés solo deja la plantilla/espacio marcado como `[PENDIENTE: FIRMA Y % DE SIMILITUD DEL ASESOR]`.** En su propia página.
3. **Declaratoria de originalidad de los autores** — firmada por el/los autor(es), declarando que no hay plagio, datos falseados ni duplicados. Mismo tratamiento que el punto 2: el arnés no la redacta como si ya estuviera firmada. En su propia página.
4. **Dedicatoria** — el arnés pregunta al alumno a quién va dirigida antes de redactarla (`contenido/dedicatoria-agradecimiento.md`); nunca un texto genérico. En su propia página.
5. **Agradecimiento** — mismo tratamiento: se pregunta a quién y por qué antes de redactar (`contenido/dedicatoria-agradecimiento.md`). En su propia página.
6. **Índice de contenidos** — generado desde los títulos reales del documento (campo real de Word vía `--toc` de Pandoc, se actualiza con F9).
7. **Índice de tablas** — generado desde las tablas reales insertadas (paso de Word: Referencias → Insertar tabla de ilustraciones → Estilo `TableCaption`, ver `../comun/exportacion/exportar-word.md`).
8. **Índice de figuras** — mismo mecanismo, estilo `ImageCaption`.
9. **Resumen** + palabras clave (3 a 5 términos). En su propia página — la guía APA 7 real lo exige explícitamente ("comience el resumen en una nueva página").
10. **Abstract** + keywords (traducción fiel del resumen, no una versión distinta). En su propia página, separada del Resumen.

## Cuerpo

### I. Introducción

- Contexto y relevancia del tema.
- Adelanto de la estructura del documento.
- Objetivos general y específicos: **se presentan como 2-3 opciones y el alumno elige** (`contenido/objetivos.md`), nunca se fijan directamente.

### II. Marco teórico

- **Antecedentes**, organizados por alcance si el volumen lo justifica: internacionales, nacionales, locales. Cada uno: autor, año, qué investigó, método, hallazgo principal, relevancia para este trabajo.
- **Bases teóricas** de cada variable del título, sustentadas en fuentes verificadas.
- **Definición de términos básicos**, si la rúbrica/asesor lo exige.

### III. Metodología

- 3.1. Tipo y diseño de investigación.
- 3.2. Variables y operacionalización (tabla: variable, definición conceptual, definición operacional, dimensiones, indicadores, escala de medición).
- 3.3. Población, muestra y muestreo.
- 3.4. Técnicas e instrumentos de recolección de datos — **punto de control**: muestra calculada + instrumento construido + piloto real + alfa de Cronbach ≥ 0.70 antes de seguir con el resto de la tesis (`contenido/instrumento-y-muestra.md`).
- 3.5. Procedimiento.
- 3.6. Método de análisis de datos.
- 3.7. Aspectos éticos.

> Nota: en tesis de diseño no experimental/documental, algunas de estas subsecciones se simplifican (ej. no hay "muestra" si el trabajo es un análisis documental de tesis existentes, como en una de las tesis analizadas).

### IV. Resultados

- **Punto de control previo**: el instrumento validado (3.4) se aplica a toda la muestra y el alumno trae `output/trabajo/datos-principales.csv` con los datos reales — sin ese archivo no se redacta esta sección (`contenido/recoleccion-datos-principal.md`).
- Presentación de hallazgos por objetivo/hipótesis, con tablas y figuras propias (no reutilizadas de otras fuentes).

### V. Discusión

- Contraste de los resultados propios contra los antecedentes del marco teórico: en qué coincide, en qué difiere, y por qué. Esta sección es distinta de Resultados y de Conclusiones — no se fusionan.

### VI. Conclusiones

- Una por cada objetivo específico, más una síntesis del objetivo general. No se introduce información nueva.

### VII. Recomendaciones

- Derivadas directamente de las conclusiones; en algunos formatos se dividen en recomendaciones dirigidas a la organización/caso de estudio y recomendaciones para futuras investigaciones.

## Cierre

- **Referencias bibliográficas** — formato APA, generadas solo desde metadatos guardados (`investigacion.md` / `referencias.bib`).
- **Anexos** — patrón estándar observado: (1) matriz de consistencia, (2) matriz de operacionalización, (3) instrumento completo, (4) prueba de confiabilidad, (5) validación por juicio de expertos, (6) cartas/autorizaciones, (7) reporte de similitud Turnitin. Detalle y reglas en `contenido/anexos.md`.

---

## Reglas específicas de tesis (además de las de `../../AGENTS.md`)

1. La declaratoria de autenticidad del asesor y la declaratoria de originalidad de los autores nunca se redactan como si ya estuvieran firmadas ni se inventa un porcentaje de similitud. Se deja el espacio marcado como pendiente de firma real.
2. El índice de tablas y el índice de figuras se generan solo a partir de tablas/figuras que existen de verdad en el documento — no se listan de forma genérica.
3. La Discusión no repite los Resultados ni adelanta las Conclusiones: conecta los hallazgos propios con el Marco teórico.
4. El Resumen/Abstract se redacta al final, cuando ya existen resultados y conclusiones reales que resumir (`contenido/resumen-abstract.md`).
5. El título pasa el protocolo de verificación de disponibilidad (RENATI, ALICIA, Google Scholar, repositorio propio) antes de confirmarse, y se re-verifica su coherencia con el contenido antes de exportar (`contenido/titulo-y-variables.md`).
6. La matriz de consistencia se crea temprano y se mantiene cuadrada durante todo el desarrollo — no es solo un anexo final (`contenido/matriz-de-consistencia.md`).
7. Toda tabla y figura sigue el formato numerado título-arriba/fuente-abajo y se genera solo con datos reales (`contenido/tablas-y-figuras.md`).
8. Los objetivos (general y cada específico) se presentan como opciones y el alumno elige — nunca se fijan sin esa elección (`contenido/objetivos.md`).
9. La Dedicatoria y el Agradecimiento se preguntan antes de redactarse ("¿a quién?") — nunca un texto genérico (`contenido/dedicatoria-agradecimiento.md`).
10. No se redacta ninguna sección más allá de Metodología 3.4 sin que el instrumento tenga alfa de Cronbach ≥ 0.70 confirmado por `../comun/herramientas/confiabilidad.js` sobre datos reales de un piloto (`contenido/instrumento-y-muestra.md`).
11. Declaratorias, Dedicatoria, Agradecimiento, Resumen y Abstract van cada uno en su propia página en la exportación final (`../comun/exportacion/exportar-word.md`).
12. No se redacta Resultados (ni Discusión, Conclusiones, Recomendaciones) sin `output/trabajo/datos-principales.csv` real — el instrumento validado aplicado a toda la muestra, nunca el CSV del piloto (`contenido/recoleccion-datos-principal.md`).

## Reducción a informe (no-tesis)

Para un informe, monografía o ensayo que no es tesis, se usa `../informe/estructura-informe-maestra.md`, que quita: declaratorias de autenticidad/originalidad, dedicatoria/agradecimiento, índices separados de tablas y figuras (se integran al índice general), variables y operacionalización formal, población/muestra/muestreo y discusión como capítulo aparte (se fusiona con el desarrollo). El resto del orden (introducción → planteamiento → marco teórico → desarrollo → conclusiones → referencias → anexos) se mantiene.
