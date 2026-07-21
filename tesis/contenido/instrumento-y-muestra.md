---
seccion: Instrumento y muestra (gate previo a Resultados)
aplica_a: tesis
---

# Instrumento y muestra — antes de seguir redactando

Este es un **punto de control**, no solo contenido a redactar. Ninguna skill continúa la tesis más allá de la Metodología (3.4) sin pasar por esta secuencia completa y en este orden.

## Secuencia obligatoria

0. **Determinar el tipo de instrumento**: antes de calcular nada, confirmar (o preguntar, si no es evidente del diseño) qué tipo de instrumento corresponde — encuesta con escala Likert, prueba/test, ficha de observación, lista de cotejo, ficha documental, o guía de entrevista/focus group. Ver `tipos-de-instrumento.md`: ahí cambia la escala, el coeficiente de confiabilidad e incluso si aplica piloto numérico o no. Los pasos 1-4 de abajo son los de un instrumento cuantitativo estándar (encuesta/prueba/observación/lista de cotejo); para documental o cualitativo, `tipos-de-instrumento.md` explica qué cambia.
1. **Tamaño de muestra**: correr `node ../../comun/herramientas/muestra.js --N <población>` (finita) o `--infinita` (infinita/desconocida), según el diseño (ver `../../comun/formulas/elegir-diseno.md`). Si el muestreo es estratificado (ej. por ciclo, sede, turno), agregar `--estratos "Nombre1:N1,Nombre2:N2,..."` para obtener también el `n` por estrato (afijación proporcional). Si el alumno prefiere no memorizar los flags, `node ../../comun/herramientas/muestra.js --interactivo` pregunta cada valor paso a paso. El resultado va en Metodología 3.3.
2. **Construir el instrumento**: por cada indicador de la tabla de operacionalización (Metodología 3.2), redactar uno o más ítems que lo midan, con el formato y la escala que corresponden al tipo determinado en el paso 0 (Likert 1-5 para encuestas, dicotómico para listas de cotejo/pruebas, etc. — nunca asumir Likert por defecto sin haber pasado por el paso 0). Cada ítem se redacta como pregunta o afirmación clara, sin doble negación, sin dos ideas en un mismo ítem. El instrumento completo queda en `trabajo/instrumento.md` (y se copia como Anexo 3 al exportar).
3. **Piloto**: el alumno aplica el instrumento a un grupo pequeño (mínimo orientativo: 15 casos) **fuera del arnés** — esto es trabajo de campo real, no algo que la IA pueda simular. Los resultados se guardan en un CSV (filas = encuestados/casos, columnas = ítems), ej. `trabajo/piloto.csv`.
4. **Confiabilidad**: correr `node ../../comun/herramientas/confiabilidad.js trabajo/piloto.csv` (alfa de Cronbach para ítems Likert, `--kr20` si son dicotómicos). El resultado real (no estimado) va en Metodología 3.4.

## Regla dura: gate de calidad del instrumento

- **Si alfa ≥ 0.70**: el instrumento queda validado. Se continúa con el resto de la tesis (Resultados en adelante).
- **Si alfa < 0.70**: **no se redacta nada más allá de Metodología 3.4.** Se identifican los ítems con menor aporte (`../../comun/herramientas/confiabilidad.js` imprime la varianza por ítem; los de varianza muy alta o muy baja respecto al resto suelen ser los problemáticos — para un diagnóstico más fino, el alumno puede correr la correlación ítem-total en SPSS/Jamovi), se reformulan o se eliminan, y se repite el piloto (paso 3) hasta alcanzar alfa ≥ 0.70.

Este umbral (0.70) es el estándar académico más común; si el asesor o la universidad exige uno distinto, se ajusta en `trabajo/brief.md` y se aplica aquí en su lugar.

## Por qué este orden importa

Redactar Resultados, Discusión o Conclusiones antes de confirmar que el instrumento mide bien lo que dice medir es construir la tesis sobre datos que podrían no ser confiables — cualquier corrección posterior del instrumento obligaría a rehacer todo lo redactado después. Por eso este es un punto de control, no un paso más de una lista.
