---
name: construir-instrumento
description: Calcula la muestra, guía la construcción del instrumento por indicador, exige validez de contenido por juicio de expertos (V de Aiken ≥0.80, ficha real a jueces reales) antes del piloto, y exige alfa de Cronbach ≥0.70 (piloto real, con correlación ítem-total) antes de permitir seguir redactando la tesis más allá de Metodología.
---

## Disparador

La operacionalización de variables (Metodología 3.2) ya está definida, y toca avanzar a población/muestra y técnicas e instrumentos (3.3-3.4).

## Qué hace

Sigue `../../tesis/contenido/instrumento-y-muestra.md` paso a paso, sin saltarse ninguno:

1. Verifica primero `node --version` (regla 20 de `../../../AGENTS.md`).
2. **Determina el tipo de instrumento** que corresponde al diseño ya declarado en Metodología 3.1 (`../../tesis/contenido/tipos-de-instrumento.md`): encuesta Likert, prueba/dicotómico, ficha de observación, lista de cotejo, ficha documental, o guía de entrevista/focus group. Si el diseño no lo deja claro, pregunta directamente al alumno cómo va a recoger los datos — nunca asume "encuesta Likert" por defecto.
3. Calcula la muestra (si el tipo de instrumento la requiere — documental/cualitativo suele no llevar muestra probabilística): `node nucleo/comun/herramientas/muestra.js --N <población> --salida output/trabajo/calculo-muestra.md` (agregar `--estratos` si el muestreo es estratificado, o `--interactivo` si el alumno prefiere que se lo pregunten paso a paso). Copia el resultado desde el archivo a Metodología 3.3, no de memoria (regla 29).
4. Redacta, junto con el alumno, los ítems del instrumento con el formato y la escala que corresponden al tipo determinado en el paso 2 — uno o más por cada indicador de la tabla de operacionalización — y los deja en `output/trabajo/instrumento.md`.
5. Genera la versión imprimible para el piloto: `node nucleo/comun/herramientas/generar_instrumento_html.js output/trabajo/instrumento.md --salida output/entregables/instrumento.html --universidad "..." --carrera "..." --autor "..."` (usa los datos de autoría de `output/trabajo/brief.md`).
6. **Juicio de expertos (antes del piloto)** — solo si el tipo de instrumento lo requiere (ver `tipos-de-instrumento.md`; para instrumentos cuantitativos estándar sí aplica siempre):
   - Genera la ficha de validación en blanco: `node nucleo/comun/herramientas/generar_instrumento_html.js output/trabajo/instrumento.md --salida output/entregables/ficha-experto.html --ficha-experto`. Dile al alumno que la imprima (Ctrl+P → Guardar como PDF) una copia por juez (mínimo 3, recomendado 3-5, incluyendo a su asesor de tesis).
   - Se detiene y le pide que lleve la ficha a jueces reales y traiga las calificaciones **reales** que reciba en un CSV (ej. `output/trabajo/juicio-expertos.csv`, filas = ítems, columnas = jueces). **No continúa sin ese archivo real, y nunca genera ni estima esas calificaciones.**
   - Corre `node nucleo/comun/herramientas/validez-contenido.js output/trabajo/juicio-expertos.csv --salida output/trabajo/calculo-aiken.md`.
   - **Gate: V de Aiken ≥ 0.80.** Si algún ítem sale por debajo, señala cuál (con las observaciones que dejó el juez, si las hay) y le dice al alumno que hay que reformularlo/eliminarlo y repetir la ficha con los jueces antes de seguir. **No avanza al piloto (paso 7) con ítems que no pasaron este gate.**
7. Se detiene y le pide al alumno que aplique el piloto (mínimo ~15 casos, o la validación que corresponda al tipo — ver `tipos-de-instrumento.md` para documental/cualitativo) fuera del arnés, con el instrumento ya validado por expertos, y traiga los datos en un CSV. **No continúa sin ese archivo real.**
8. Corre `node nucleo/comun/herramientas/confiabilidad.js output/trabajo/piloto.csv --salida output/trabajo/calculo-alfa.md` (o `--kr20` si el instrumento es dicotómico) sobre los datos reales del piloto — solo si el tipo de instrumento lleva confiabilidad numérica. El script imprime también la correlación ítem-total de cada ítem.
9. **Gate**: si alfa/KR-20 ≥ 0.70 (o el instrumento no requiere este coeficiente por su tipo y la validación correspondiente ya se hizo), confirma que el instrumento queda validado y habilita seguir con el resto de la tesis. Si el coeficiente aplica y sale < 0.70, señala los ítems más problemáticos (correlación ítem-total < 0.30, ya impresa por el script) y le dice al alumno que hay que reformularlos y repetir el piloto — **no redacta Resultados, Discusión, Conclusiones ni Recomendaciones mientras el gate no se supere**.

## No hace

No asume el tipo de instrumento sin confirmarlo con el diseño o con el alumno. No inventa datos de piloto para "avanzar más rápido". **No genera ni simula calificaciones de jueces — la ficha de validación siempre sale en blanco; las calificaciones son datos reales que el alumno transcribe de su asesor/jueces.** No baja el umbral de 0.70 (alfa) ni el de 0.80 (V de Aiken) sin que el alumno confirme en `output/trabajo/brief.md` que su asesor/universidad exige otro. No calcula el alfa, la correlación ítem-total ni la V de Aiken a mano ni los estima — siempre corre el script correspondiente (regla 17).
