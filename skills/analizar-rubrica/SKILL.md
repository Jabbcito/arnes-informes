---
name: analizar-rubrica
description: Convierte la rúbrica/consigna del docente en un brief confirmado por el alumno. Primer paso obligatorio del arnés.
---

## Disparador

El alumno trae una foto, PDF o Word de la rúbrica/consigna a `insumos/`.

## Qué hace

1. Lee todo el contenido de `insumos/`.
2. Extrae: tipo de trabajo, entregables pedidos, formato, extensión, fecha límite, criterios de evaluación, audiencia y restricciones explícitas.
3. Escribe o actualiza `output/trabajo/brief.md` con esos campos.
4. Lista explícitamente qué dato falta o qué parte de la rúbrica no queda clara — nunca rellena una duda con un supuesto.

## Punto de control

No continúa al siguiente paso hasta que el alumno responda: "Sí, esta interpretación refleja lo que pidió el docente".

## No hace

No investiga fuentes ni redacta ninguna sección todavía.
