# Arnés de creación de informes académicos

Sistema de reglas, plantillas y scripts para que un agente de IA (OpenCode, Claude Code o Codex) ayude a un estudiante universitario a redactar una **tesis** (o, próximamente, un informe/monografía) de forma estructurada: con fuentes verificables, formato APA 7 real, cálculos estadísticos hechos por código (nunca "a ojo" por la IA), y puntos de control que obligan a traer datos reales de campo antes de avanzar.

No es un generador de tareas de un solo clic. El agente construye el trabajo sección por sección, se detiene a pedir confirmación o datos reales cuando corresponde, y nunca inventa autores, cifras, encuestas ni referencias.

## Cómo se usa

1. **Duplica esta carpeta** para cada proyecto real (una copia por alumno/tesis) — este repo es la plantilla, no se edita directamente.
2. Abre la copia en OpenCode (o Claude Code / Codex) apuntando a esa carpeta:
   ```bash
   opencode "mi-tesis"
   ```
3. Empieza la conversación pidiendo ayuda con tu tarea/tesis. El agente lee `AGENTS.md` y `ROUTING.md` automáticamente y sigue el flujo desde ahí.

## Estructura

```
AGENTS.md              Reglas no negociables + flujo obligatorio paso a paso
ROUTING.md              Punto de entrada: qué archivo abrir según la tarea
CLAUDE.md               Puente para Claude Code (apunta a AGENTS.md/ROUTING.md)
fuentes-permitidas.md    Bases de datos y repositorios autorizados para citar
skills/                  17 skills — Markdown plano, misma carpeta para cualquier IA
comun/
  apa/                   Reglas APA 7 (extraídas de la guía real, no de memoria)
  formulas/               Qué fórmula/prueba corresponde a cada diseño de estudio
  herramientas/            Scripts Node.js: muestra, confiabilidad, descriptivos, correlación, verificación
  exportacion/             Pipeline Markdown → Word (Pandoc) → PDF, y plantilla de slides
tesis/
  contenido/              Un archivo por sección de la tesis
  estructura-tesis-maestra.md
informe/
  estructura-informe-maestra.md   Versión reducida (no-tesis, en desarrollo)
```

`comun/` no es exclusivo de tesis: el mismo formato APA, las mismas fórmulas y el mismo pipeline de exportación sirven igual para un informe o monografía — por eso vive fuera de `tesis/`.

## Multi-herramienta (OpenCode, Claude Code, Codex, o cualquier otro agente)

Nada en este arnés depende del mecanismo propietario de ninguna herramienta (no hay `.opencode/`, `.claude/` ni `.codex/`). `AGENTS.md`, `ROUTING.md` y `skills/*/SKILL.md` son Markdown plano en carpetas de nombre neutro — cualquier agente los lee como documentos de instrucciones siguiendo `ROUTING.md`, que dice exactamente qué abrir para cada paso. Esto es intencional: se prioriza que el arnés funcione igual en cualquier IA por encima de aprovechar el autocompletado nativo `/nombre-skill` que algunas herramientas ofrecen para sus propias carpetas de skills.

## Qué genera el arnés en tu proyecto

Estas carpetas no vienen en la plantilla — las crea el agente (o tú) a medida que trabajas, dentro de tu copia del proyecto:

```
mi-tesis/
├── insumos/            # lo que TÚ aportas: rúbrica, indicaciones del asesor, lecturas obligatorias
├── fuentes/              # fuentes académicas encontradas (PENDIENTE DE VERIFICAR / VERIFICADA)
├── anexos/imagenes/       # evidencia visual: fichas firmadas, capturas de SPSS, cartas
└── output/
    ├── trabajo/            # borradores: informe.md, brief.md, matriz, checklist, piloto.csv, datos-principales.csv
    └── entregables/         # DOCX/PDF/slides finales
```

Regla dura (27 en `AGENTS.md`): si compartes algo relevante en el chat — pegas el texto de tu rúbrica, describes una foto, mencionas un dato — el agente lo guarda en el archivo correspondiente en el mismo turno, nunca lo deja solo en la conversación. El contexto del chat no sobrevive entre sesiones; los archivos sí.

## Requisitos

- **Node.js** (LTS) — para los scripts de `comun/herramientas/`. El arnés comprueba `node --version` antes de usarlos y avisa si falta.
- **Pandoc** — para exportar a Word/PDF (`comun/exportacion/`).
- **LibreOffice** o Microsoft Word — para convertir el DOCX final a PDF y hacer el acabado manual (numeración romana/arábiga, índices).

## Punto de partida

Empieza siempre por [ROUTING.md](ROUTING.md) — es el índice que decide qué otro archivo abrir según la tarea puntual, para no cargar todo el arnés de una vez.
