# Skills del arnés

Cada skill vive en su propia carpeta como `skills/<nombre>/SKILL.md`, con frontmatter `name` (igual al nombre de la carpeta) y `description` — el mismo formato del estándar abierto [Agent Skills](https://agentskills.io) que usan OpenCode, Claude Code y Codex, pero en una carpeta neutra (`skills/`, no `.opencode/`, `.claude/` ni `.codex/`) para que cualquier IA las lea igual, sin depender del mecanismo de auto-descubrimiento propio de una herramienta. Se abren siguiendo `../ROUTING.md`, que dice cuál corresponde a cada paso.

Cada skill cubre un tramo del flujo definido en `../AGENTS.md` y `../tesis/estructura-tesis-maestra.md` (o `../informe/estructura-informe-maestra.md`). Ninguna skill genera el informe completo; cada una hace un paso y se detiene para que el alumno revise. Para el contenido concreto de cada sección, cada skill abre solo su archivo correspondiente en `../tesis/contenido/` (ver `../ROUTING.md`).

| Orden | Skill | Cubre |
|---|---|---|
| 1 | `analizar-rubrica` | Rúbrica/consigna → `brief.md` |
| 2 | `definir-titulo-variables` | Título + variables + **verificación de disponibilidad del título** (RENATI, ALICIA, Scholar, repositorio propio) → `verificacion-titulo.md` |
| 3 | `definir-objetivos` | Objetivo general y específicos **redactados como opciones**; el alumno elige |
| 4 | `investigar-fuentes` | Búsqueda en `fuentes-permitidas.md` → `investigacion.md` |
| 5 | `construir-marco-teorico` | Antecedentes (por alcance en tesis) + bases teóricas (solo fuentes VERIFICADA) |
| 6 | `construir-instrumento` | Muestra (simple o estratificada) + ítems por indicador + piloto real + **gate de alfa de Cronbach ≥0.70** antes de seguir |
| 7 | `recolectar-datos-principales` | **Segundo gate**: exige `trabajo/datos-principales.csv` real (instrumento aplicado a toda la muestra) antes de Resultados |
| 8 | `redactar-seccion` | Planteamiento, introducción, desarrollo/resultados, conclusiones, recomendaciones |
| 9 | `redactar-discusion` | Discusión (solo tesis): contrasta resultados propios contra el marco teórico |
| 10 | `redactar-preliminares` | Dedicatoria/Agradecimiento — **pregunta a quién** antes de redactar |
| 11 | `generar-tabla` | Tablas y figuras con caption nativo de Pandoc (negrita/cursiva reales), datos solo reales, exportables como tablas nativas de Word |
| 12 | `generar-indice-y-referencias` | Índice de contenidos real + índice de tablas/figuras (paso de Word) + referencias con sangría francesa real (custom-style) |
| 13 | `verificar-citas` | QA por código (`../comun/herramientas/verificar_citas.js`): citas↔referencias↔fuentes VERIFICADAS + formato APA de citas |
| 14 | `verificar-formato` | QA por código (`../comun/herramientas/verificar_estructura.js`) + revisión contra `comun/apa/`: numeración, secciones, títulos, estilo |
| 15 | `auditar-tesis` | Auditoría integral pre-exportación (matriz, citas, formato, estadística, anexos, título). Pre-requisito de exportar |
| 16 | `exportar-entrega` | Carátula, anexos, DOCX/PDF vía Pandoc + plantilla APA, checklist final. Deja pendientes de firma las declaratorias — nunca inventa el % de Turnitin |
| 17 | `generar-slides` | `informe.md` → plantilla `comun/exportacion/plantillas/slides-base.html` → PDF (PPTX opcional) |

Transversal: la **matriz de consistencia** (`trabajo/matriz-consistencia.md`) se crea con `generar-tabla` apenas existen problema/objetivos/hipótesis, y toda skill que toque objetivos, hipótesis o variables la mantiene cuadrada (regla 14 de `../AGENTS.md`). Todo cálculo estadístico pasa por `../comun/herramientas/` o SPSS/Jamovi (regla 17) — nunca aritmética "de cabeza".
