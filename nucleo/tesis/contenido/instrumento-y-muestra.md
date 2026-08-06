---
seccion: Instrumento y muestra (gate previo a Resultados)
aplica_a: tesis
---

# Instrumento y muestra — antes de seguir redactando

Este es un **punto de control**, no solo contenido a redactar. Ninguna skill continúa la tesis más allá de la Metodología (3.4) sin pasar por esta secuencia completa y en este orden.

## Secuencia obligatoria

0. **Determinar el tipo de instrumento**: antes de calcular nada, confirmar (o preguntar, si no es evidente del diseño) qué tipo de instrumento corresponde — encuesta con escala Likert, prueba/test, ficha de observación, lista de cotejo, ficha documental, o guía de entrevista/focus group. Ver `tipos-de-instrumento.md`: ahí cambia la escala, el coeficiente de confiabilidad e incluso si aplica piloto numérico o no. Los pasos 1-5 de abajo son los de un instrumento cuantitativo estándar (encuesta/prueba/observación/lista de cotejo); para documental o cualitativo, `tipos-de-instrumento.md` explica qué cambia.
1. **Tamaño de muestra**: correr `node ../../comun/herramientas/muestra.js --N <población>` (finita) o `--infinita` (infinita/desconocida), según el diseño (ver `../../comun/formulas/elegir-diseno.md`). Si el muestreo es estratificado (ej. por ciclo, sede, turno), agregar `--estratos "Nombre1:N1,Nombre2:N2,..."` para obtener también el `n` por estrato (afijación proporcional). Si el alumno prefiere no memorizar los flags, `node ../../comun/herramientas/muestra.js --interactivo` pregunta cada valor paso a paso. El resultado va en Metodología 3.3.
2. **Construir el instrumento**: por cada indicador de la tabla de operacionalización (Metodología 3.2), redactar uno o más ítems que lo midan, con el formato y la escala que corresponden al tipo determinado en el paso 0 (Likert 1-5 para encuestas, dicotómico para listas de cotejo/pruebas, etc. — nunca asumir Likert por defecto sin haber pasado por el paso 0). Cada ítem se redacta como pregunta o afirmación clara, sin doble negación, sin dos ideas en un mismo ítem. El instrumento completo queda en `output/trabajo/instrumento.md` (y se copia como Anexo al exportar).
3. **Juicio de expertos (validez de contenido)** — antes del piloto, no junto con él:
   - Generar la ficha de validación en blanco: `node ../../comun/herramientas/generar_instrumento_html.js output/trabajo/instrumento.md --salida output/entregables/ficha-experto.html --ficha-experto`. La ficha trae los ítems reales del instrumento con columnas vacías de Claridad/Relevancia/Pertinencia (1-4) y observaciones — **el arnés nunca llena esas columnas ni genera calificaciones**; solo la estructura para que la llene un juez real.
   - El alumno lleva una copia impresa (o el PDF) a 3-5 jueces reales (su asesor de tesis y otros docentes/expertos en el tema), y transcribe las calificaciones **reales** que recibe a un CSV, ej. `output/trabajo/juicio-expertos.csv` (filas = ítems, columnas = jueces).
   - Correr `node ../../comun/herramientas/validez-contenido.js output/trabajo/juicio-expertos.csv --salida output/trabajo/calculo-aiken.md`. El resultado real va en Metodología 3.4 (antes del piloto).
   - **Gate: V de Aiken ≥ 0.80** (global y por ítem). Los ítems que no llegan al umbral se reformulan o eliminan siguiendo las observaciones de los jueces, y se repite la ficha con los jueces para esos ítems antes de continuar al piloto. No se avanza al paso 4 con ítems que no pasaron este gate.
4. **Piloto**: una vez validado el instrumento por los expertos, el alumno lo aplica a un grupo pequeño (mínimo orientativo: 15 casos) **fuera del arnés** — esto es trabajo de campo real, no algo que la IA pueda simular. Los resultados se guardan en un CSV (filas = encuestados/casos, columnas = ítems), ej. `output/trabajo/piloto.csv`.
5. **Confiabilidad**: correr `node ../../comun/herramientas/confiabilidad.js output/trabajo/piloto.csv` (alfa de Cronbach para ítems Likert, `--kr20` si son dicotómicos). Si el instrumento tiene **más de una dimensión** (operacionalizadas en Metodología 3.2), se corre además con `--dimensiones <etiqueta por cada columna, en orden>` (ej. `--dimensiones D1,D1,D2,D2`) — el alfa por dimensión es obligatorio, no opcional, porque un alfa global alto puede esconder una dimensión por debajo del umbral. El script imprime también la correlación ítem-total corregida de cada ítem, el IC 95% del coeficiente, la alerta de redundancia (α > 0.95) y los pares de ítems casi duplicados (r ≥ 0.90). El resultado real (no estimado) va en Metodología 3.4.

## Regla dura: gates de calidad del instrumento

- **Gate 1 — Juicio de expertos**: si V de Aiken ≥ 0.80, el instrumento pasa a piloto. Si algún ítem sale por debajo, se reformula/elimina y se repite el paso 3 con los jueces antes de aplicar el piloto — **no se aplica el piloto con ítems que no pasaron este gate**.
- **Gate 2 — Confiabilidad**: si alfa/KR-20 ≥ 0.70, el instrumento queda validado y se continúa con el resto de la tesis (Resultados en adelante). Si sale < 0.70, **no se redacta nada más allá de Metodología 3.4.** Se identifican los ítems problemáticos con la correlación ítem-total que ya imprime `confiabilidad.js` (r < 0.30 → revisar/eliminar), se reformulan o eliminan, y se repite el piloto (paso 4) hasta alcanzar alfa ≥ 0.70. **Con escala multidimensional, TODAS las dimensiones deben pasar el umbral con su alfa por dimensión (`--dimensiones`), no solo el alfa global.** Además: si el alfa supera 0.95, la alerta de redundancia del script se atiende revisando los pares de ítems con r ≥ 0.90 (fusionar/eliminar y repetir piloto); si el alfa supera 0.90, al menos se documenta la revisión de redundancia en Metodología 3.4.

Estos umbrales (0.80 y 0.70) son los estándares académicos más comunes; si el asesor o la universidad exige otros, se ajustan en `output/trabajo/brief.md` (`--umbral` en `validez-contenido.js`) y se aplican aquí en su lugar.

## Instrumento validado — cierre del punto de control

Cuando ambos gates se superan, el instrumento queda "validado" (no solo "aplicado"): fue revisado por jueces reales, corregido según sus observaciones, y probado con datos reales de piloto. Recién entonces se aplica a la muestra completa calculada en el paso 1, y se continúa con Resultados.

**Nota sobre validez de constructo (opcional):** para diseños explicativos o correlacionales complejos con muchos ítems, el asesor puede pedir además un Análisis Factorial Exploratorio (AFE) que confirme que los ítems se agrupan en las dimensiones planificadas. El arnés no lo calcula (ver `../../comun/formulas/formulas-referencia.md`) — se corre en SPSS/Jamovi/R si el diseño lo requiere. No es parte del gate estándar de arriba.

## Por qué este orden importa

Redactar Resultados, Discusión o Conclusiones antes de confirmar que el instrumento mide bien lo que dice medir es construir la tesis sobre datos que podrían no ser confiables — cualquier corrección posterior del instrumento obligaría a rehacer todo lo redactado después. Por eso el juicio de expertos va antes del piloto (revisar la redacción de los ítems con datos reales de campo es más caro que revisarla antes), y por eso todo esto es un punto de control, no un paso más de una lista.
