---
name: definir-titulo-variables
description: Define el título del informe y las variables de estudio a partir del brief confirmado. Segundo paso del arnés.
---

## Disparador

`output/trabajo/brief.md` ya está confirmado por el alumno.

## Qué hace

Sigue el patrón y el protocolo de `../../tesis/contenido/titulo-y-variables.md`:

1. Propone un título tentativo derivado del brief, con el patrón `[Variable 1] y/para [Variable 2] en/de [población], [lugar], [año]`.
2. Identifica y nombra explícitamente la(s) variable(s) de estudio, con el nombre exacto que se usará en todo el documento.
3. **Verifica la disponibilidad del título**: busca el título tentativo (y la combinación variables+población) en RENATI, ALICIA, Google Scholar y el repositorio de la universidad del alumno. Registra en `output/trabajo/verificacion-titulo.md`: fecha, dónde buscó, títulos similares encontrados (con enlace) y veredicto (`DISPONIBLE` / `SIMILAR ENCONTRADO` / `OCUPADO`).
4. Si hay similares, propone diferenciarse **primero por un eje seguro** (población, lugar, periodo — no tocan el objeto de estudio), y solo si no alcanza, por un eje que cambia el objeto de estudio (enfoque o segunda variable). No basta con cambiar sinónimos. Si se usa un eje que cambia el objeto de estudio y ya existen fuentes registradas en `fuentes/investigacion.md` o una matriz de consistencia construida, se detiene de inmediato y revisa con el alumno qué queda desalineado — no espera a la auditoría final (ver `../../tesis/contenido/titulo-y-variables.md`).
5. Deja el título marcado como "tentativo" hasta que exista el planteamiento del problema, momento en el que puede ajustarse (y se re-verifica si cambió sustancialmente — mismo criterio del paso 4: eje seguro primero, revisión inmediata si se toca enfoque/segunda variable con trabajo ya invertido).

## Salida

Sección "Título y variables" en `output/trabajo/esquema.md` + `output/trabajo/verificacion-titulo.md`.

## Punto de control

El alumno abre él mismo los enlaces de títulos similares encontrados y confirma el veredicto, antes de pasar a investigar fuentes.

## No hace

Nunca afirma que el título está "100% libre" — solo reporta qué buscó, dónde, en qué fecha y qué encontró (hay tesis en curso no publicadas; la verificación final la hace la universidad al inscribir el proyecto).
