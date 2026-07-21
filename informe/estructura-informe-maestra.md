# Estructura del informe de investigación (versión reducida de la tesis)

Esta plantilla es una reducción de `../tesis/estructura-tesis-maestra.md` para trabajos que no son tesis: informes, monografías, ensayos. Se basa en el mismo estándar (validado contra tesis reales de repositorios universitarios peruanos), quitando las piezas exclusivas de una tesis formal: declaratorias de autenticidad/originalidad firmadas por asesor y autores, dedicatoria/agradecimiento, índices separados de tablas y figuras, variables y operacionalización formal, población/muestra/muestreo, y discusión como capítulo aparte (aquí se fusiona con el desarrollo). Para trabajos más simples aún (ensayo corto, exposición) se recortan más pasos, pero el orden y el control de evidencia no cambian.

Regla general: cada sección se construye **una por una**, con la evidencia verificada disponible en ese momento. Ninguna skill genera el informe completo de un solo prompt.

---

## 1. Título + variables de estudio

- Título tentativo, derivado de la consigna/rúbrica.
- Identificación explícita de la(s) variable(s) de estudio (qué se investiga, sobre qué población o contexto, en qué periodo si aplica).
- El título se ajusta después de definir el planteamiento del problema; no queda cerrado desde el inicio.

## 2. Carátula

- Nombre de la universidad, facultad y escuela profesional.
- Título del trabajo.
- Autor(es) y código/matrícula si la rúbrica lo pide.
- Curso, docente, ciclo/sección.
- Ciudad y fecha.
- Formato exacto según lo que exija la rúbrica o el estilo de la universidad (no se inventa un formato genérico si la rúbrica especifica uno).

## 3. Índice

- Generado automáticamente a partir de los títulos y subtítulos reales del documento (no se escribe a mano ni se inventan números de página).
- Incluye todas las secciones de este documento que apliquen: introducción, planteamiento, marco teórico, objetivos, metodología, desarrollo, conclusiones, recomendaciones, referencias, anexos.
- Se regenera cada vez que cambia la estructura del informe.

## 4. Introducción

- Contexto general del tema.
- Relevancia del problema.
- Adelanto de la estructura del informe (qué va a encontrar el lector en cada sección).
- Se redacta al final, aunque aparezca al inicio del documento, porque depende de que el resto ya esté definido.

## 5. Planteamiento del problema

- Descripción del problema o vacío que motiva el trabajo.
- Formulación de la pregunta de investigación (general y, si aplica, específicas).
- Justificación: por qué es importante resolver o explorar esto.
- Objetivos:
  - Objetivo general.
  - Objetivos específicos (uno por cada pregunta específica, si existen).

## 6. Marco teórico / Antecedentes

Esta es la sección con más sub-partes y la que más depende de fuentes verificadas.

- **Antecedentes:** investigaciones previas (tesis, artículos, informes) relacionadas directamente con las variables del título. Cada antecedente incluye: autor, año, qué investigó, qué método usó, qué encontró, y por qué es relevante para este trabajo.
- **Bases teóricas:** definición y desarrollo de cada variable del título, sustentada en autores y fuentes verificadas — no en definiciones genéricas de memoria del modelo.
- **Definición de términos básicos**, si la rúbrica lo pide.
- Cada afirmación de esta sección debe estar conectada a una fuente marcada `VERIFICADA` en `investigacion.md`. Si no hay fuente verificada para una idea, se marca `[EVIDENCIA PENDIENTE]` y no se redacta como si fuera un hecho.

## 7. Objetivos

- Ya definidos en el planteamiento del problema (sección 5); aquí se listan de forma clara y numerada si la rúbrica exige una sección separada.

## 8. Metodología (si aplica)

- Tipo y diseño de investigación.
- Población y muestra (si el trabajo lo requiere).
- Técnicas e instrumentos de recolección de datos.
- Procedimiento.
- Esta sección solo se incluye si el trabajo es de investigación empírica; un informe descriptivo o un ensayo puede omitirla.

## 9. Desarrollo / Resultados

- Cuerpo principal del trabajo, organizado por sub-temas o por objetivos específicos.
- Cada sub-sección se redacta con evidencia verificada, citando en el cuerpo del texto (formato APA) y conectando cada afirmación a su fuente.
- Si el trabajo incluye datos propios (encuestas, análisis), se presentan aquí con su interpretación.

## 10. Conclusiones

- Una conclusión por cada objetivo específico (y una síntesis para el objetivo general).
- No se introduce información nueva que no haya aparecido en el desarrollo.

## 11. Recomendaciones

- Sugerencias concretas derivadas de las conclusiones, no genéricas.

## 12. Referencias bibliográficas (APA)

- Generadas exclusivamente desde los metadatos guardados en `referencias.bib` / `investigacion.md` (autor, año, título, fuente, URL/DOI).
- Nunca se genera una referencia desde la memoria del modelo.
- Todas las fuentes citadas en el cuerpo del texto deben aparecer aquí, y viceversa (no hay referencias "huérfanas" ni citas sin referencia).

## 13. Anexos

- Instrumentos usados (encuestas, guías de entrevista), evidencia adicional, tablas extensas, capturas o documentos que la rúbrica pida adjuntar.

---

## Regla de cierre

Antes de dar por completo un informe, se verifica contra esta plantilla: qué secciones aplicaban según la rúbrica, cuáles están completas, cuáles tienen `[EVIDENCIA PENDIENTE]`, y si el índice, la carátula y las referencias coinciden con el contenido real del documento.
