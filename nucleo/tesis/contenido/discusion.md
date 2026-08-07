---
seccion: Discusión
aplica_a: tesis
---

# Discusión

Se organiza **por objetivo** (general primero, luego cada específico), y cada bloque repite esta secuencia:

1. Recuerda qué objetivo se está discutiendo.
2. Retoma el resultado inferencial obtenido (cifra + significancia).
3. Lo compara explícitamente contra 2 o 3 antecedentes del marco teórico: dice si es congruente, similar o diferente, citando autor y su hallazgo.
4. Retoma también el dato descriptivo relevante (frecuencias) como apoyo.
5. Conecta el hallazgo con una o dos teorías del marco teórico (corrobora o cuestiona la teoría).

## Regla dura: correlación no es mediación

En diseños transversales (medición simultánea, sin orden temporal), **nunca se afirma que una variable "media", "explica" o "es el mecanismo" de la relación entre otras dos** — Maxwell y Cole (2007) muestran que los datos transversales casi siempre fallan al estimar procesos mediacionales y pueden sugerir mediación donde no existe. Si una dimensión correlaciona más fuerte que otra, se formula como *"la asociación fue más fuerte con la dimensión X"* y la mediación queda como hipótesis para estudios longitudinales. Solo un análisis explícito de mediación (p. ej., SPSS PROCESS, SEM) sobre datos con orden temporal justifica el término (Hayes, 2013).

## Regla dura: confusores antes de interpretar

Antes de dar por interpretable un resultado significativo, se revisa si una tercera variable podría explicarlo — los confusores más comunes son **edad y sexo** (y según el contexto: ciclo, procedencia, estrato). Si esos datos existen en `output/trabajo/datos-principales.csv`, se coteja el hallazgo contra los descriptivos sociodemográficos de `resultados.md` y se comenta si la asociación podría variar al controlar por ellos. La confusión residual (variables no medidas) se declara en las Limitaciones.

Esto es razonamiento, no cálculo — ningún script puede hacerlo por la IA (el ejemplo clásico: el consumo de helados y las muertes por ahogo correlacionan porque ambos suben en verano; el confusor es la estación, no una relación directa entre ellos). Por eso, antes de redactar la interpretación de **cualquier** correlación/asociación reportada como relevante, se responde por escrito este checklist de 3 preguntas (las respuestas van en el propio texto de la Discusión, no se ocultan):

1. **¿Hay una tercera variable plausible que explique ambas a la vez?** Nombrar 1-2 candidatas concretas para el diseño real del estudio (edad, carrera, ciclo, carga horaria, turno...) — no copiar una lista genérica sin pensarla para este caso.
2. **¿Ambas variables se midieron con el mismo método (autoinforme) en la misma ocasión?** Si sí, nombrar explícitamente el riesgo de **varianza de método común** (*common method bias*: Podsakoff, MacKenzie, Lee y Podsakoff, 2003, *Journal of Applied Psychology*, 88(5), 879-903) en Limitaciones — no basta con la línea genérica ya prevista abajo, se explica cómo aplica a las variables concretas del estudio.
3. **¿La muestra por conveniencia tiene una composición conocida distinta a la de la población?** Si el alumno conoce N y la composición real (ej. matrícula por carrera o sexo del padrón), se contrasta explícitamente contra la muestra obtenida (ver tabla sociodemográfica de `resultados.md`) y se discute la dirección probable del sesgo — no basta con decir "muestra por conveniencia, no representativa" sin más.

## Subsección obligatoria: Limitaciones del estudio

La Discusión cierra siempre con la subsección **"Limitaciones del estudio"** (estándar STROBE, ítems 19-21: sesgo potencial con su dirección y magnitud, interpretación cautelosa, generalizabilidad). Para el diseño típico del arnés (transversal, autoinforme, conveniencia), toca como mínimo:

- **Autoinforme**: deseabilidad social y sesgo de memoria; las cifras describen lo que los participantes declararon.
- **Diseño transversal**: medición simultánea → no permite inferir causalidad ni dirección de la relación.
- **Muestreo**: si fue por conveniencia o no probabilístico, la muestra no representa a toda la población y los resultados no generalizan.
- **Confusión residual**: variables no medidas que podrían explicar parte de la asociación.
- **Varianza de método común** (si aplica): variables medidas con el mismo instrumento comparten varianza no sustantiva.

Se redactan con tono académico estándar (no autodescalificación), se conectan con cómo afectan la interpretación, y se cierran con qué estudios futuros las resolverían. Si el alumno no sabe cuáles declarar, se le pregunta antes de redactarlas — nunca se inventan.

## Depende de

`resultados.md` (ya redactado y aprobado) y `antecedentes.md` / `bases-teoricas.md` (ya existentes, con fuentes `VERIFICADA`).

## No hacer

No repite literalmente lo ya dicho en Resultados ni adelanta las Conclusiones. Cada comparación cita la fuente `VERIFICADA` del antecedente contra el que se contrasta. Esta sección solo aplica a tesis — en informes reducidos, el contraste con antecedentes se integra directamente en el desarrollo.
