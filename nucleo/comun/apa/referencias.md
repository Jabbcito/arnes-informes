---
tema: Lista de referencias APA 7
fuente: Guía Normas APA 7ª edición (normas-apa.org)
---

# Referencias APA 7

## Formato de la lista

- Página nueva, título **Referencias** centrado y en negrita (sin comillas ni subrayado). **Esto es lo único en negrita de toda la sección** — las entradas individuales NO van en negrita, ni el apellido del autor ni ninguna otra parte.
- Doble espacio en toda la lista.
- **Sangría francesa** de ½ pulgada (1.27 cm) en cada entrada — se aplica de verdad en la exportación envolviendo las entradas con `::: {custom-style="Bibliography"} ... :::`, ver `../exportacion/exportar-word.md`.
- Los títulos de libro/artículo/tesis dentro de cada entrada van en **cursiva** (con `*texto*` en Markdown — se conserva como cursiva real al exportar).
- Orden **alfabético** por primer apellido del autor (invertido: Apellido, Inicial.).
- Correspondencia 1:1 con el texto: toda entrada citada, toda cita con entrada (lo comprueba `../herramientas/verificar_citas.js`).

## Los 4 elementos de toda referencia

**Quién** (autor) · **Cuándo** (año) · **Qué** (título) · **Dónde** (fuente de recuperación: revista/editorial/repositorio + DOI/URL).

## Reglas de la 7ª edición

- Hasta **20 autores** se listan todos (Apellido, I., Apellido, I., ... y Apellido, I.). Con 21+: los primeros 19, puntos suspensivos (sin "y") y el último.
- **No** se incluye ciudad/país de la editorial.
- **No** se escribe "Recuperado de" antes de una URL (salvo que se necesite fecha de recuperación por ser contenido cambiante).
- No insertar saltos de línea manuales en DOI/URL largos.
- Comunicaciones personales (correos, llamadas, entrevistas propias) se citan solo en el texto, NO van en Referencias.
- Menciones genéricas de webs/publicaciones completas no requieren referencia.

## Plantillas por tipo de fuente (las que más usa una tesis)

- **Artículo de revista:** Apellido, I. (año). Título del artículo. *Nombre de la Revista, volumen*(número), páginas. https://doi.org/xxxx
- **Tesis de repositorio:** Apellido, I. (año). *Título de la tesis* [Tesis de licenciatura/maestría/doctorado, Universidad]. Nombre del repositorio. URL
- **Libro:** Apellido, I. (año). *Título del libro* (edición si no es la 1ª). Editorial.
- **Capítulo de libro editado:** Apellido, I. (año). Título del capítulo. En I. Apellido (Ed.), *Título del libro* (pp. xx-xx). Editorial.
- **Página web con autor:** Apellido, I. (año, día de mes). *Título de la página*. Nombre del sitio. URL
- **Organismo/institución:** Nombre del organismo. (año). *Título del documento*. URL
- **Norma/ley:** Nombre de la norma, número (año). URL — el formato exacto legal puede variar según la universidad; confirmar en el brief.

## Regla dura del arnés

Cada entrada se **genera desde los metadatos guardados** en `fuentes/investigacion.md` / `fuentes/referencias.bib` — autor, año, título, fuente, DOI/URL registrados al verificar la fuente. Nunca se redacta una referencia de memoria, ni se "completa" un DOI o volumen que no se registró: si falta un dato, se marca `[EVIDENCIA PENDIENTE]` y el alumno vuelve a la fuente a buscarlo.
