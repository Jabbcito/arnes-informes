---
name: verificar-citas
description: Verifica con código que toda cita esté bien hecha, tenga referencia y provenga de fuente VERIFICADA. Corre verificar_citas.js y traduce el reporte en correcciones.
---

## Disparador

Al terminar cada capítulo con citas, y obligatoriamente dentro de `auditar-tesis` antes de exportar.

## Qué hace

1. Verifica primero `node --version` (regla 20 de `../../../AGENTS.md`); si falla, se detiene y sigue las instrucciones de `../../comun/herramientas/README.md`.
2. Ejecuta:
   ```
   node nucleo/comun/herramientas/verificar_citas.js --informe output/trabajo/informe.md --investigacion fuentes/investigacion.md --salida output/trabajo/reporte-citas.md
   ```
3. Lee el reporte y convierte cada PROBLEMA en una corrección concreta en `output/trabajo/informe.md` o `fuentes/investigacion.md` (con confirmación del alumno cuando implique volver a la fuente).
4. Los AVISOS se revisan uno a uno con el alumno (ej. cita textual sin página → buscar la página real en la fuente, nunca inventarla).
5. Revisa el formato fino que el script no cubre, contra `../../comun/apa/citas.md` y `../../comun/apa/referencias.md` (et al., "y" vs "&", bloque ≥40 palabras, cursivas y DOI en referencias).

## Lo que el código NO puede validar (revisión humana obligatoria)

- Que la paráfrasis refleje fielmente lo que la fuente dice.
- Que el año citado corresponda a esa afirmación concreta.

El arnés se lo recuerda al alumno explícitamente y no marca la verificación como completa sin esa confirmación.

## No hace

Nunca "arregla" una cita inventando datos (página, año, autor). Si el dato falta, se vuelve a la fuente o se marca `[EVIDENCIA PENDIENTE]`.
