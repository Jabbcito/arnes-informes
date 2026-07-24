# Fuentes permitidas

El arnés solo debe buscar, citar o recomendar fuentes que estén en esta lista. Si el alumno quiere agregar una base de datos, revista o repositorio adicional, la agrega él mismo en la sección "Fuentes agregadas por el alumno" antes de empezar a investigar.

Ninguna fuente entra al informe solo por estar en esta lista: además debe pasar por `investigacion.md` y quedar marcada `VERIFICADA` por el alumno (ver regla de verificación en `AGENTS.md`).

---

## Bases académicas generales

| Fuente | URL | Tipo |
|---|---|---|
| OpenAlex | https://openalex.org | 250M+ trabajos, gratis, sin clave — consultado por código vía `node nucleo/comun/herramientas/buscar_fuentes.js` (metadatos estructurados + enlace directo a PDF de acceso abierto, en vez de raspar una página de resultados) |
| CrossRef | https://www.crossref.org | 150M+ trabajos, gratis, sin clave — consultado por código vía `node nucleo/comun/herramientas/verificar_doi.js` como chequeo de refuerzo de que un DOI existe de verdad |
| Google Scholar | https://scholar.google.com | Buscador académico general |
| SciELO | https://scielo.org | Revistas científicas de acceso abierto |
| Redalyc | https://www.redalyc.org | Revistas científicas de acceso abierto |
| Dialnet | https://dialnet.unirioja.es | Portal de difusión científica hispana |
| DOAJ | https://doaj.org | Directorio de revistas de acceso abierto |
| CORE | https://core.ac.uk | Agregador de millones de repositorios de acceso abierto |
| BASE | https://base-search.net | Motor de búsqueda académico (Universidad de Bielefeld) |
| Semantic Scholar | https://www.semanticscholar.org | Buscador académico con resúmenes e indexación por IA |
| ERIC | https://eric.ed.gov | Base especializada en educación — útil para tesis educativas/pedagógicas |
| Latindex | https://www.latindex.org | Catálogo de revistas científicas de América Latina, el Caribe, España y Portugal |

## Fuentes oficiales de Perú

| Fuente | URL | Tipo |
|---|---|---|
| ALICIA (CONCYTEC) | https://alicia.concytec.gob.pe | Repositorio nacional de ciencia y tecnología |
| RENATI (SUNEDU) | https://renati.sunedu.gob.pe | Registro nacional de trabajos de investigación y grados |

## Repositorios universitarios peruanos (ejemplos frecuentes)

> El alumno debe usar el repositorio de **su propia universidad** cuando exista, además de estos. Antes de citar cualquier repositorio, confirma que la URL sigue activa: los repositorios institucionales cambian de dominio con cierta frecuencia.

| Universidad | Repositorio (verificar vigencia antes de usar) |
|---|---|
| PUCP | repositorio.pucp.edu.pe |
| UNMSM | cybertesis.unmsm.edu.pe |
| UNI | repositorio.uni.edu.pe |
| UNALM | repositorio.lamolina.edu.pe |
| UNSA | repositorio.unsa.edu.pe |
| Universidad César Vallejo (UCV) | repositorio.ucv.edu.pe |
| Universidad Continental | repositorio.continental.edu.pe |
| Universidad San Martín de Porres (USMP) | repositorio.usmp.edu.pe |

## Fuentes agregadas por el alumno

> El alumno completa esta tabla con bases de datos propias de su carrera o universidad (ej. bases especializadas de su facultad, revistas indexadas de su área). El arnés las trata igual que las de arriba una vez agregadas aquí.

| Fuente | URL | Tipo | Agregada por |
|---|---|---|---|
| | | | |

---

## Reglas de uso

1. El arnés solo consulta lo que está en esta tabla (o lo que el alumno pega directamente como enlace de una fuente específica ya encontrada).
2. Nunca se cita una fuente que no se pueda abrir y verificar.
3. Si una búsqueda en estas bases no da resultado suficiente, el arnés lo informa explícitamente y sugiere ampliar la búsqueda o agregar una fuente nueva — no inventa una referencia para llenar el vacío.
