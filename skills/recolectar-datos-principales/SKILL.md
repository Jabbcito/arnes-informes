---
name: recolectar-datos-principales
description: Segundo gate del arnés. Exige que el alumno traiga el dataset real de la muestra completa (no el piloto) antes de permitir redactar Resultados, Discusión, Conclusiones o Recomendaciones.
---

## Disparador

El instrumento ya está validado (Metodología 3.4 con alfa ≥ 0.70 real) y toca avanzar a Resultados.

## Qué hace

Sigue `../../tesis/contenido/recoleccion-datos-principal.md` paso a paso:

1. Confirma la precondición: Metodología 3.4 tiene un alfa de Cronbach real registrado, no `[PENDIENTE...]`. Si no está, se detiene y redirige a la skill `construir-instrumento`.
2. Le recuerda al alumno que debe aplicar el mismo instrumento validado a toda la muestra `n` (Metodología 3.3) — trabajo de campo real, fuera del arnés.
3. Se detiene y pide `output/trabajo/datos-principales.csv` con los datos reales. **No continúa sin ese archivo.**
4. Al recibirlo, compara el número de filas contra el `n` de 3.3 y avisa si hay una diferencia importante (posible CSV incompleto o equivocado), sin bloquear si el alumno confirma que es correcto.
5. Solo entonces habilita correr `node comun/herramientas/descriptivos.js` / `node comun/herramientas/correlacion.js` sobre `output/trabajo/datos-principales.csv` y redactar Resultados (`tesis/contenido/resultados.md`).

## No hace

No usa `output/trabajo/piloto.csv` para Resultados — ese archivo es solo del gate de confiabilidad. No inventa filas de ejemplo para avanzar mientras el alumno termina de recolectar. No redacta Discusión, Conclusiones ni Recomendaciones si Resultados quedó con `[EVIDENCIA PENDIENTE]` por falta de este archivo.
