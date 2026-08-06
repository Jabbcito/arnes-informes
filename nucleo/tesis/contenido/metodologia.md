---
seccion: Metodología
aplica_a: tesis
---

# Metodología

Sigue siempre este orden, con contenido específico en cada punto:

1. **Tipo y diseño**: tipo (básica/aplicada — criterio CONCYTEC, ver abajo), enfoque (cuantitativo/cualitativo/mixto), nivel/alcance (descriptivo, correlacional, explicativo), diseño (experimental, no experimental, pre-experimental), cada término definido y citado (no basta con nombrarlo).
2. **Variables y operacionalización**: por cada variable, un párrafo en prosa con la definición conceptual + definición operacional (citando la fuente `VERIFICADA`, no repetido dentro de la tabla) — seguido de la tabla de operacionalización con **solo 4 columnas**: variable, dimensiones, indicadores, escala de medición. Las celdas van con frases cortas (no oraciones completas): esto es necesario para que la tabla quepa legible incluso en orientación horizontal (ver `../../comun/exportacion/exportar-word.md`, "Tablas anchas") — una tabla de 6 columnas con oraciones largas queda ilegible en la exportación, verificado.
3. **Población, muestra y muestreo**: población con criterios de inclusión y exclusión explícitos; muestra (tamaño y cómo se calculó, o unidad de análisis si es un estudio documental/observacional en vez de encuesta); tipo de muestreo.
4. **Técnicas e instrumentos**: técnica (encuesta, observación directa, análisis documental) + instrumento (cuestionario, ficha de registro) + validez (juicio de expertos, cuántos) + confiabilidad (alfa de Cronbach u otro coeficiente, con el valor obtenido si ya existe piloto).
5. **Procedimiento**: pasos concretos de cómo se ejecutó la recolección y el análisis, en orden cronológico.
6. **Método de análisis de datos**: análisis descriptivo (qué software: SPSS, Excel) + análisis inferencial (prueba de normalidad → qué prueba estadística se usa según el resultado: paramétrica si es normal, no paramétrica —Spearman, Shapiro-Wilk, t de Student— si no lo es).
7. **Aspectos éticos**: consentimiento informado, confidencialidad, beneficencia, no maleficencia, justicia. Antes de redactar esta subsección, preguntar explícitamente al alumno si el estudio involucra **población vulnerable, menores de edad, o datos de salud** — en ese caso, además del párrafo de consentimiento informado del propio instrumento, suele exigirse la aprobación formal de un **comité de ética institucional** (distinto del consentimiento informado, que es del participante; el comité de ética es de la institución/universidad). Si aplica y el dictamen aún no existe, se marca `[PENDIENTE: DICTAMEN COMITÉ DE ÉTICA]` (mismo criterio que Turnitin — nunca se inventa una aprobación) y se agrega como Anexo (ver `anexos.md`). Marco normativo a citar: la Ley 30220 (revisión por comité de ética institucional), la RM N° 233-2020-MINSA (*Consideraciones éticas para investigación en salud con seres humanos*) cuando el estudio involucra personas o datos de salud, y el Código Nacional de Integridad Científica (Resolución de Presidencia N° 028-2024-CONCYTEC-P), que además exige declarar **financiamiento y conflictos de interés** — la subsección cierra con esa declaración, marcada `[EVIDENCIA PENDIENTE]` si el alumno no la confirma.

## Criterio CONCYTEC: básica vs. aplicada

La clasificación se hace con el criterio de las normas peruanas (Ley 31250 y Ley 30806, en línea con el Manual de Frascati de la OCDE), no a gusto del redactor:

- **Básica**: trabajos experimentales o teóricos para obtener nuevos conocimientos sobre los fundamentos de los fenómenos y los hechos observables, **sin una intención de aplicación específica**. Un estudio descriptivo o correlacional sin intervención es **básica** — aunque los resultados puedan sugerir aplicaciones.
- **Aplicada**: busca determinar los medios para cubrir una **necesidad reconocida y específica** (diseño pre-experimental/experimental, propuesta o intervención que se aplica y se evalúa).

El tipo declarado debe ser defendible en la sustentación: diseño no experimental y transversal → básica con su alcance (ej. correlacional); propuesta/intervención aplicada y evaluada → aplicada. Si el alumno no puede explicar qué necesidad concreta resuelve la tesis, no se declara aplicada.

## Regla dura: Turnitin en Aspectos éticos

Varias tesis reales mencionan en esta subsección que se usó Turnitin para verificar un porcentaje de similitud aceptable. Esto **solo se redacta si el reporte ya existe de verdad**. Si no existe todavía, se marca `[PENDIENTE: REPORTE TURNITIN]` — nunca se inventa un porcentaje (ver regla 11 de `../../../AGENTS.md`). Ver `../../comun/apa/originalidad-y-similitud.md` para cómo reducir el riesgo mientras se redacta, y qué hacer si el alumno ya tiene un reporte con porcentaje alto.

## Fórmulas y cálculos de esta sección

Qué fórmula corresponde al diseño: `../../comun/formulas/elegir-diseno.md`. Cómo se escribe cada una: `../../comun/formulas/formulas-referencia.md`. Los cálculos se corren con los scripts (`node ../../comun/herramientas/muestra.js`, `node ../../comun/herramientas/confiabilidad.js piloto.csv --dimensiones D1,D1,D2,...` cuando la escala tiene más de una dimensión — ver `../../comun/herramientas/README.md`) o en SPSS/Jamovi — nunca a mano por la IA (regla 17 de `../../../AGENTS.md`).

## No hacer

No saltar directo a "resultados" sin haber definido variables, población y técnicas primero — el orden de este documento es también el orden de dependencia real.
