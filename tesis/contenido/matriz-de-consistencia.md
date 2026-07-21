---
seccion: Matriz de consistencia
aplica_a: tesis
---

# Matriz de consistencia

Aparece como **Anexo 1 en la mayoría de tesis reales analizadas**, pero no es un adorno final: es la herramienta de control de coherencia interna de toda la tesis. El arnés la crea temprano (apenas existen problema, objetivos e hipótesis) en `output/trabajo/matriz-consistencia.md`, la mantiene actualizada, y al final la exporta como anexo.

## Estructura (patrón observado)

Una tabla donde cada fila alinea los elementos que deben corresponderse uno a uno:

| Problema | Objetivo | Hipótesis | Variables y dimensiones | Metodología |
|---|---|---|---|---|
| Problema general (pregunta) | Objetivo general | Hipótesis general | Variable 1 + sus dimensiones / Variable 2 + sus dimensiones | Tipo, nivel, diseño, enfoque, población, muestra, técnica, instrumento |
| Problema específico 1 | Objetivo específico 1 | Hipótesis específica 1 | Dimensión relacionada | (misma columna metodológica) |
| Problema específico 2 | Objetivo específico 2 | Hipótesis específica 2 | Dimensión relacionada | |
| ... | ... | ... | ... | |

## Reglas de coherencia que la matriz obliga a cumplir

1. **Misma cantidad y mismo orden**: N problemas específicos = N objetivos específicos = N hipótesis específicas (si el diseño lleva hipótesis). Cada fila se corresponde.
2. **Mismas palabras**: la pregunta, el objetivo y la hipótesis de una misma fila usan las mismas variables con el mismo nombre — solo cambia la forma gramatical (¿Cuál es la relación...? / Determinar la relación... / Existe relación...).
3. **Cada dimensión de la operacionalización aparece** en algún problema/objetivo específico (en diseños correlacionales, el patrón típico es: una hipótesis específica por dimensión de la variable 1 cruzada con la variable 2).
4. La columna de metodología coincide exactamente con lo declarado en el capítulo de Metodología.

## Cuándo se actualiza

Cada vez que cambia el título, un objetivo, una hipótesis o una dimensión. Si la matriz deja de cuadrar, la tesis tiene una incoherencia — se corrige antes de seguir redactando.

## Formato

Se mantiene como tabla Markdown en `output/trabajo/matriz-consistencia.md` (ver `tablas-y-figuras.md` para las reglas de tablas y su exportación). En la exportación final va como Anexo 1, normalmente en orientación horizontal por su ancho.
