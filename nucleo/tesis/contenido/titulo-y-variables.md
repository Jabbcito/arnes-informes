---
seccion: Título y variables de estudio
aplica_a: tesis
---

# Título y variables de estudio

El título es lo primero que se define y lo último que se cierra. Debe cumplir cuatro condiciones a la vez:

1. **Contiene las variables de estudio** (una o dos, según el diseño), la población/contexto y, si aplica, el periodo. Patrón observado en tesis reales: `[Variable 1] y/para [Variable 2] en/de [población/organización], [lugar], [año]`.
2. **Es coherente con todo el contenido**: los objetivos, hipótesis, marco teórico y conclusiones giran sobre exactamente las mismas variables del título. Si en algún punto la tesis empieza a hablar de otra cosa, o cambia el título o cambia el contenido.
3. **Está disponible**: no puede ser idéntico (ni prácticamente idéntico) a un título ya registrado en otra tesis. Ver protocolo abajo.
4. **Se entiende solo**: alguien que solo lee el título sabe qué se investigó, dónde y cuándo.

## Protocolo de verificación de disponibilidad del título

Antes de dar un título por confirmado, se ejecuta esta búsqueda y se registra la evidencia:

1. Buscar el título tentativo (entre comillas, y también sin comillas) en:
   - **RENATI** (https://renati.sunedu.gob.pe) — registro nacional de trabajos de investigación; es donde quedan registrados los títulos de tesis peruanas.
   - **ALICIA** (https://alicia.concytec.gob.pe).
   - **Google Scholar** y Google normal.
   - El **repositorio de la propia universidad** del alumno.
2. Buscar también la combinación de variables + población (sin el formato exacto del título), porque un título "casi igual" con palabras cambiadas sigue siendo un problema.
3. Registrar el resultado en `output/trabajo/verificacion-titulo.md`: fecha de búsqueda, dónde se buscó, qué títulos similares se encontraron (con enlace), y el veredicto: `DISPONIBLE`, `SIMILAR ENCONTRADO (ajustar)` o `OCUPADO (cambiar)`.
4. Si hay títulos similares, diferenciarse **primero por un eje seguro** — no basta con cambiar sinónimos:
   - **Ejes seguros** (no tocan el objeto de estudio — usarlos primero): **población, lugar, periodo**. Cambiar cualquiera de estos no invalida nada de lo ya investigado sobre las variables.
   - **Ejes que cambian el objeto de estudio** (usar solo si los ejes seguros no alcanzan para diferenciarse): **enfoque, o la segunda variable**. Cambiar uno de estos significa que la tesis pasa a tratar de algo distinto — no es un simple reemplazo de palabras en el título.

   **Regla dura si se usa un eje que cambia el objeto de estudio**: antes de seguir, revisar si ya existen `fuentes/investigacion.md` con fuentes registradas y/o `output/trabajo/matriz-consistencia.md` construida sobre las variables/enfoque anteriores.
   - Si el título es temprano (aún no hay fuentes investigadas ni matriz), no hay riesgo — se cambia con libertad y se continúa.
   - Si ya existen fuentes y/o matriz, **detenerse de inmediato** (no esperar a la auditoría final) y decírselo explícitamente al alumno: qué fuentes ya no encajan con la variable/enfoque nuevo, qué parte de la matriz hay que rehacer, y confirmar con él cómo seguir (conservar las fuentes que sí sigan siendo pertinentes, buscar las que falten, ajustar la matriz) antes de redactar nada más. Cambiar el título de este modo sin revisar lo ya construido es exactamente el escenario que hace que el cambio "no sirva de nada" — se pierde la coherencia entre lo investigado y lo que el título dice ahora.
5. El alumno confirma el veredicto abriendo él mismo los enlaces encontrados.

### Límite honesto de este protocolo

Esta búsqueda reduce muchísimo el riesgo, pero no es una garantía absoluta: hay tesis en curso aún no publicadas y repositorios no indexados. La verificación final de disponibilidad la hace la universidad/escuela al inscribir el proyecto. El arnés nunca afirma "este título está 100% libre"; afirma "no se encontró registro con esta búsqueda en estas bases, en esta fecha".

## Verificación de coherencia título ↔ contenido (al final)

Cuando la tesis está completa, antes de exportar, se repite un chequeo inverso: ¿el título sigue describiendo exactamente lo que la tesis terminó siendo? Cambios de población, de periodo o de alcance durante el desarrollo obligan a ajustar el título. Este chequeo forma parte de `checklist-final.md`.

## Variables

- Identificar cada variable con nombre exacto y consistente — la misma forma de nombrarla se usa en todo el documento (título, objetivos, hipótesis, operacionalización, tablas).
- Anotar desde ya qué tipo de variable es (según el diseño: independiente/dependiente, o variable 1/variable 2 en correlacionales), porque eso define la matriz de consistencia y la operacionalización.
