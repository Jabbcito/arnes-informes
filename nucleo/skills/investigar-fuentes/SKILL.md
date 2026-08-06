---
name: investigar-fuentes
description: Busca al menos 15 fuentes verificables (≤5 años de antigüedad) sobre las variables de estudio, las descarga y lee completas, y las registra en investigacion.md como PENDIENTE DE VERIFICAR.
---

## Disparador

Título y variables ya confirmados.

## Qué hace

### Fase A — Cuota y vigencia

1. Antes de buscar, arma el checklist de categorías que exigen `../../tesis/contenido/bases-teoricas.md` y `../../tesis/contenido/antecedentes.md`:
   - 2 a 4 fuentes de **definición conceptual** por cada variable del título.
   - 1 fuente (mínimo) por cada **dimensión** declarada de cada variable.
   - 3 a 5 fuentes de **teorías formales** relacionadas (nombre de la teoría + autor que la formuló).
   - El resto como **antecedentes empíricos** (estudios que midieron estas variables o similares).
   - Si el diseño lo requiere (ej. cifras oficiales, base de datos pública): fuentes tipo **dataset** — con origen, acceso, fecha de descarga y permiso de uso, y se citan como fuente en Referencias.
2. Formula búsquedas concretas por variable/dimensión/teoría. Primero corre `node nucleo/comun/herramientas/buscar_fuentes.js "<término>" --desde <año>` (consulta OpenAlex, gratis y sin clave — trae autor/año/DOI/revista reales y el enlace directo al PDF cuando el trabajo es de acceso abierto, evitando raspar una página de resultados de buscador que a veces esconde un bloqueo anti-bot). Completa con búsqueda manual dentro de `../../../fuentes-permitidas.md` para lo que OpenAlex no cubra bien (ej. repositorios universitarios peruanos específicos).
3. Reúne **mínimo 15 fuentes candidatas** con año de publicación ≤5 años respecto a la fecha real en que se ejecuta el arnés (no una fecha fija — usa la fecha del sistema).
4. Si tras una búsqueda razonable no se llega a 15 fuentes en esa ventana de 5 años, **amplía a 10 años** y dilo explícitamente en una sección nueva "Ampliación de vigencia" en `fuentes/investigacion.md` (qué categoría no tenía suficientes fuentes recientes y por qué se amplió).
5. Si aun ampliando a 10 años no se llega a 15, **detente y pregunta al alumno** cómo seguir: bajar el mínimo, agregar él mismo fuentes en `../../../fuentes-permitidas.md`, o aceptar menos fuentes con esa limitación documentada. Nunca completes la cuota en silencio ni sigas adelante con menos de lo pedido sin decirlo.

### Fase B — Descarga y extracción real (nunca te quedes con el resumen del buscador)

6. Por cada fuente candidata, corre `node nucleo/comun/herramientas/descargar_fuente.js <url> --salida fuentes/pdfs/<nombre>` para guardarla en `fuentes/pdfs/`.
7. Si la descarga falla (bloqueo anti-bot, 404, timeout — el script lo reporta con claridad), registra el intento fallido en `fuentes/investigacion.md` (sección "Búsquedas que no dieron fuente utilizable") — no completes los campos de esa fuente con lo que dice un resumen de buscador sin haberla leído.
8. Si la descarga funciona y el archivo es un PDF, `descargar_fuente.js` ya generó automáticamente un `.txt` con el texto extraído (`fuentes/pdfs/<nombre>.pdf.txt`) — **lee ese `.txt` completo**, no el PDF binario: esto garantiza la lectura completa sin depender de si tu herramienta de IA sabe abrir PDF de forma nativa. Si el script avisó que no pudo extraer texto (documento escaneado), abre el PDF original con tu propia herramienta de lectura como respaldo. Si el archivo es HTML, léelo directo. Nunca te quedes solo con el título/resumen del resultado de búsqueda. Extrae los campos reales:
   - Autor(es), año, título, revista/fuente.
   - **Categoría**: definición-conceptual / dimensión / teoría / antecedente-empírico (según para qué se buscó).
   - Si es antecedente empírico: país/contexto, objetivo del estudio, tipo/diseño, muestra/técnica, resultado con cifra concreta, conclusión.
   - Si es **dataset**: origen, acceso (URL o DOI), fecha de descarga, permiso/licencia de uso, y para qué cifra se usará.
   - Si es conceptual/teórica: la definición o el postulado citado tal como aparece en el texto (no una paráfrasis de un resumen).
9. Si la fuente tiene DOI, corre `node nucleo/comun/herramientas/verificar_doi.js <DOI>` como chequeo de refuerzo: confirma que el DOI existe de verdad y trae sus metadatos reales para comparar contra lo que vas a registrar. No reemplaza el paso 8 (leer la fuente completa).
10. Registra cada fuente en `fuentes/investigacion.md` con estos campos (afirmación útil, autor, año, título, fuente, URL, categoría, y los campos empíricos si aplica) y estado `PENDIENTE DE VERIFICAR`. Incluye una nota de vigencia (año de publicación vs. fecha de ejecución del arnés).

## No hace

No inventa fuentes. No redacta el informe. No marca ninguna fuente como `VERIFICADA` — eso solo lo hace el alumno al abrir el enlace y confirmar autor, año y pertinencia. No completa un campo (país, diseño, muestra, definición) con lo que dice el resumen de un buscador si no pudo leer la fuente completa — en ese caso el campo queda `[EVIDENCIA PENDIENTE]` y se documenta el intento de descarga fallido.
