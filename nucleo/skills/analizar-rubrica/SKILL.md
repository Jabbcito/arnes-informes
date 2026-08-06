---
name: analizar-rubrica
description: Convierte la rúbrica/consigna del docente en un brief confirmado por el alumno. Primer paso obligatorio del arnés.
---

## Disparador

El alumno trae una foto, PDF o Word de la rúbrica/consigna a `insumos/`.

## Qué hace

1. Lee todo el contenido de `insumos/`.
2. Extrae: tipo de trabajo (con una pregunta explícita: **¿trabajo bibliográfico o investigación empírica con recolección de datos?** — cambia el flujo posterior: un trabajo bibliográfico no lleva instrumento, piloto ni gates de confiabilidad y usa la estructura reducida de informe), entregables pedidos, formato, extensión, fecha límite, criterios de evaluación, audiencia y restricciones explícitas. **Nivel de exigencia**: registrar el estándar esperado (básico de universidad peruana vs. científico/revista) tal como se deduce de la rúbrica y de la universidad. Los requisitos del arnés se mantienen estrictos en ambos casos — lo que cambia es el **lenguaje**: cada requisito se explica al alumno con palabras simples y con el porqué académico, para que pueda sustentarlo (nunca se rebaja un requisito "porque es nivel básico"; ver criterio CONCYTEC en `../../tesis/contenido/metodologia.md`).
3. **Pregunta directamente los datos de autoría** (no están en la rúbrica del docente, hay que pedirlos): nombre(s) del/los autor(es), carrera/escuela profesional, facultad, universidad, nombre del asesor, línea de investigación y ciudad — los mismos campos que exige la carátula (`../../tesis/estructura-tesis-maestra.md`, sección Preliminares §1). Si es tesis con dos o más autores, pide el nombre completo de cada uno.
4. Escribe o actualiza `output/trabajo/brief.md` con los campos de la rúbrica (paso 2: tipo de trabajo —bibliográfico/empírico—, nivel de exigencia) y una sección aparte "Datos de autoría" (paso 3).
5. Lista explícitamente qué dato falta o qué parte de la rúbrica no queda clara — nunca rellena una duda ni un dato de autoría con un supuesto.

## Punto de control

No continúa al siguiente paso hasta que el alumno responda: "Sí, esta interpretación refleja lo que pidió el docente" **y** haya confirmado sus datos de autoría.

## No hace

No investiga fuentes ni redacta ninguna sección todavía.
