---
seccion: Tipos de instrumento — qué formulario corresponde a cada diseño
aplica_a: tesis
---

# Tipos de instrumento — antes de construir el formulario

No todo estudio se mide con una encuesta de escala Likert. El instrumento correcto depende del diseño ya declarado en Metodología 3.1 (`metodologia.md`, `../../comun/formulas/elegir-diseno.md`). Este archivo se abre desde `instrumento-y-muestra.md`, **antes** de redactar un solo ítem, para no asumir por defecto el tipo más común (Likert) cuando el diseño pide otra cosa.

## Cómo se decide

1. Leer el diseño ya declarado en Metodología 3.1.
2. Si el diseño mapea claramente a un tipo de instrumento en la tabla de abajo, confirmarlo con el alumno en una frase ("Tu estudio es correlacional cuantitativo, así que el instrumento es una encuesta con escala Likert — ¿correcto?") en vez de asumirlo en silencio.
3. Si el diseño es ambiguo, mixto, o el alumno no lo tiene claro todavía, **preguntar directamente**: "¿Vas a recoger datos con encuesta (preguntas cerradas y una escala), observación (tú o un evaluador registra lo que ve), entrevista (preguntas abiertas, se transcribe), o análisis de documentos/registros ya existentes?" — la respuesta determina todo lo que sigue.

## Tabla de tipos de instrumento

| Diseño (3.1) | Instrumento | Formato de reactivos | Escala/registro | Confiabilidad |
|---|---|---|---|---|
| Correlacional / descriptivo cuantitativo | **Cuestionario/encuesta** | Afirmaciones o preguntas cerradas, una por indicador | Likert (1-5 o 1-7 más común), o de razón/intervalo si mide cantidades | Alfa de Cronbach (`confiabilidad.js`) |
| Pre-experimental / cuasi-experimental / experimental | **Cuestionario** (igual que arriba, aplicado dos veces: pre y post) o **prueba/test** con ítems de respuesta correcta/incorrecta | Likert o dicotómico (correcto/incorrecto) según qué se mida | Alfa de Cronbach (Likert) o KR-20 (dicotómico) |
| Estudios con variable de conducta observable (ej. desempeño, comportamiento) | **Ficha/lista de observación** | Un ítem por conducta/indicador a observar, con presencia/ausencia o frecuencia | Escala dicotómica (Sí/No) o de frecuencia (Nunca-Siempre) | KR-20 si es dicotómica; Alfa si es de frecuencia |
| Verificación de cumplimiento de criterios (ej. auditoría, checklist normativo) | **Lista de cotejo** | Un ítem por criterio a verificar | Dicotómica (Cumple/No cumple) | KR-20 |
| Documental / revisión de registros existentes | **Ficha de análisis documental / matriz de registro** | Una fila por documento/caso, columnas = variables a extraer | No aplica escala de actitud — son datos que ya existen en la fuente | No aplica alfa/KR-20 — la "confiabilidad" es el criterio de inclusión/exclusión bien definido, no un piloto |
| Cualitativo (entrevistas, focus group) | **Guía de entrevista / guía de focus group** | Preguntas abiertas organizadas por categoría o eje temático | No hay escala — se transcribe y categoriza | No aplica alfa; la validez es por juicio de expertos (V de Aiken si se cuantifica, ver `../../comun/formulas/formulas-referencia.md`) o triangulación |

## Qué cambia en la secuencia según el tipo

- **Cuestionario/prueba (Likert o dicotómico)**: sigue la secuencia completa de `instrumento-y-muestra.md` tal cual — muestra → ítems → piloto → alfa/KR-20 ≥0.70.
- **Ficha de observación / lista de cotejo**: misma secuencia, pero el piloto se aplica observando/verificando casos reales (no encuestando), y el coeficiente es KR-20 si es dicotómica.
- **Ficha documental**: no hay muestra probabilística ni piloto de confiabilidad numérica — el "instrumento" se valida asegurando que los criterios de inclusión/exclusión estén bien definidos y sean aplicables sin ambigüedad (ver `../../comun/formulas/elegir-diseno.md`, caso documental). El gate de este caso es que la matriz de registro esté completa con datos reales de los documentos, no con un alfa.
- **Guía de entrevista/focus group**: tampoco hay alfa de Cronbach — la "validación" habitual es el juicio de expertos (cuantificable con V de Aiken) y, si el alumno lo hace, una prueba piloto de la guía con 1-2 entrevistas para ajustar preguntas confusas, sin cálculo de confiabilidad numérica.

## Regla dura

Nunca se asume "encuesta con escala Likert" como default sin haber leído el diseño de 3.1 o preguntado al alumno. Un instrumento del tipo equivocado para el diseño invalida el análisis posterior (ej. calcular alfa de Cronbach sobre una ficha documental no tiene sentido).
