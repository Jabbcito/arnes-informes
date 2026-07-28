# Arnés de creación de informes académicos

Sistema de reglas, plantillas y scripts para que un agente de IA (OpenCode, Claude Code o Codex) ayude a un estudiante universitario a redactar una **tesis** (o, próximamente, un informe/monografía) de forma estructurada: con fuentes reales descargadas y leídas completas (no solo resúmenes de buscador), formato APA 7 real, cálculos estadísticos hechos por código (nunca "a ojo" por la IA) y con fidelidad garantizada entre lo calculado y lo que llega al documento, y puntos de control que obligan a traer datos reales de campo antes de avanzar.

No es un generador de tareas de un solo clic. El agente construye el trabajo sección por sección, se detiene a pedir confirmación o datos reales cuando corresponde, y nunca inventa autores, cifras, encuestas ni referencias.

## Cómo se usa

1. **Duplica esta carpeta** para cada proyecto real (una copia por alumno/tesis) — este repo es la plantilla, no se edita directamente.
2. Abre la copia en OpenCode (o Claude Code / Codex) apuntando a esa carpeta:
   ```bash
   opencode "mi-tesis"
   ```
3. Empieza la conversación pidiendo ayuda con tu tarea/tesis. El agente lee `AGENTS.md` y `ROUTING.md` automáticamente y, como primer paso, corre `node nucleo/comun/herramientas/inicializar_proyecto.js` — crea las carpetas de trabajo (ver más abajo) antes de seguir.

## Estructura

En la raíz de tu copia solo hay 4 archivos `.md` de entrada y dos carpetas: `nucleo/` (el motor del arnés — no se toca) y las carpetas de trabajo que se crean al iniciar (ver más abajo). Todo lo demás vive dentro de `nucleo/`, para que no se mezcle con lo que tú generas:

```
AGENTS.md              Reglas no negociables + flujo obligatorio paso a paso
ROUTING.md              Punto de entrada: qué archivo abrir según la tarea
CLAUDE.md               Puente para Claude Code (apunta a AGENTS.md/ROUTING.md)
fuentes-permitidas.md    Bases de datos y repositorios autorizados para citar
nucleo/                  El motor del arnés — no se edita, solo lo usan las skills
  skills/                  17 skills — Markdown plano, misma carpeta para cualquier IA
  comun/
    apa/                     Reglas APA 7 (extraídas de la guía real, no de memoria)
    formulas/                 Qué fórmula/prueba corresponde a cada diseño de estudio
    herramientas/              Scripts Node.js: muestra, confiabilidad, descriptivos (categóricos y numéricos), correlación, chi-cuadrado, t de Student, ANOVA, descarga de fuentes, instrumento imprimible, verificación
    exportacion/                Pipeline Markdown → Word (Pandoc) → PDF, y plantilla de slides (con tablas anchas en horizontal automáticas y referencias con sangría francesa real)
  tesis/
    contenido/                Un archivo por sección de la tesis
    estructura-tesis-maestra.md
  informe/
    estructura-informe-maestra.md   Versión reducida (no-tesis, en desarrollo)
```

`nucleo/comun/` no es exclusivo de tesis: el mismo formato APA, las mismas fórmulas y el mismo pipeline de exportación sirven igual para un informe o monografía — por eso vive fuera de `nucleo/tesis/`.

## Fuentes reales, no resúmenes de buscador

`nucleo/skills/investigar-fuentes/` no se conforma con lo que un buscador muestra en su resumen: descarga cada fuente candidata con `nucleo/comun/herramientas/descargar_fuente.js` (a `fuentes/pdfs/`) y exige leer el archivo completo antes de registrar los campos finos (país, diseño, muestra, cifra de resultado) en `fuentes/investigacion.md`. Exige además una cuota mínima de **15 fuentes con ≤5 años de antigüedad** (con una ruta de respaldo documentada: ampliar a 10 años, y si aun así no alcanza, preguntar al alumno cómo seguir) — para que `[EVIDENCIA PENDIENTE]` sea la excepción real, no el resultado por defecto de buscar poco.

Al iniciar el proyecto (`nucleo/skills/analizar-rubrica/`), el arnés también pregunta explícitamente los datos de autoría de la tesis (autor(es), carrera, facultad, universidad, asesor, línea de investigación, ciudad) — los mismos que exige la carátula — y los deja en `output/trabajo/brief.md`.

## Fidelidad de datos: nunca retipear una cifra de memoria

Todos los scripts de cálculo (`muestra.js`, `confiabilidad.js`, `descriptivos.js`, `descriptivos-numericos.js`, `correlacion.js`, `chi-cuadrado.js`, `prueba-t.js`, `anova.js`) aceptan `--salida <archivo>`: además de imprimir en terminal, escriben el mismo bloque de resultado a un archivo en `output/trabajo/` para copiarlo de ahí al informe — nunca retipeado de lo que se vio en pantalla. Cierra el único punto real donde una cifra ya calculada correctamente por código podía llegar mal al documento por un error de transcripción.

## Cobertura estadística ampliada

Además de tamaño de muestra, confiabilidad, descriptivos y correlación, el arnés ahora calcula por código:

- **Chi-cuadrado de independencia** + V de Cramér (`chi-cuadrado.js`) — validado contra un ejemplo de manual (χ²=16.667, gl=1).
- **t de Student, muestras independientes (Welch)** + d de Cohen (`prueba-t.js`) — validado contra el dataset `sleep` de R.
- **ANOVA de un factor** + eta cuadrado (`anova.js`) — validado contra el dataset `PlantGrowth` de R.
- **Descriptivos de una variable numérica cruda** (media, mediana, moda, DE, mín/máx) (`descriptivos-numericos.js`).

Pruebas de normalidad exactas, estadísticos basados en rangos (Wilcoxon, Mann-Whitney, Kruskal-Wallis), t pareada, post-hoc de ANOVA y regresiones siguen derivadas a SPSS/Jamovi a propósito — el detalle de por qué está en `nucleo/comun/herramientas/README.md`.

## Instrumento imprimible

`nucleo/comun/herramientas/generar_instrumento_html.js` convierte `output/trabajo/instrumento.md` en una encuesta física lista para imprimir (`output/entregables/instrumento.html`, con encabezado institucional, consentimiento informado y casillas de escala Likert) — para aplicar el piloto real en papel.

## Multi-herramienta (OpenCode, Claude Code, Codex, o cualquier otro agente)

Nada en este arnés depende del mecanismo propietario de ninguna herramienta (no hay `.opencode/`, `.claude/` ni `.codex/`). `AGENTS.md`, `ROUTING.md` y `nucleo/skills/*/SKILL.md` son Markdown plano en carpetas de nombre neutro — cualquier agente los lee como documentos de instrucciones siguiendo `ROUTING.md`, que dice exactamente qué abrir para cada paso. Esto es intencional: se prioriza que el arnés funcione igual en cualquier IA por encima de aprovechar el autocompletado nativo `/nombre-skill` que algunas herramientas ofrecen para sus propias carpetas de skills.

## Qué genera el arnés en tu proyecto

Estas carpetas no vienen en la plantilla — el agente las crea todas de una vez, vacías, al primer paso (`nucleo/comun/herramientas/inicializar_proyecto.js`), y luego las va llenando a medida que trabajas:

```
mi-tesis/
├── nucleo/              # el motor del arnés (ya venía en la plantilla, no se toca)
├── insumos/            # lo que TÚ aportas: rúbrica, indicaciones del asesor, lecturas obligatorias
├── fuentes/              # fuentes académicas encontradas (PENDIENTE DE VERIFICAR / VERIFICADA)
│   └── pdfs/               # PDF/HTML descargados de cada fuente, para leerlos completos
├── anexos/imagenes/       # evidencia visual: fichas firmadas, capturas de SPSS, cartas
└── output/
    ├── trabajo/            # borradores: informe.md, brief.md, matriz, checklist, piloto.csv, datos-principales.csv
    └── entregables/         # DOCX/PDF/slides finales
```

Así, al abrir tu carpeta de proyecto en el explorador de archivos, solo ves `nucleo/` (una carpeta) más tus propias carpetas de trabajo — no una decena de carpetas técnicas mezcladas.

Regla dura (27 en `AGENTS.md`): si compartes algo relevante en el chat — pegas el texto de tu rúbrica, describes una foto, mencionas un dato — el agente lo guarda en el archivo correspondiente en el mismo turno, nunca lo deja solo en la conversación. El contexto del chat no sobrevive entre sesiones; los archivos sí.

## Requisitos

- **Node.js** (LTS) — para los scripts de `nucleo/comun/herramientas/`. El arnés comprueba `node --version` antes de usarlos y avisa si falta.
- **Pandoc** — para exportar a Word/PDF (`nucleo/comun/exportacion/`).
- **LibreOffice** o Microsoft Word — para convertir el DOCX final a PDF y hacer el acabado manual (numeración romana/arábiga, índices).

## Licencia

Código disponible bajo [PolyForm Noncommercial 1.0.0](LICENSE): puedes ver, usar y modificar este arnés libremente para fines **no comerciales** (uso personal, estudio, tu propia tesis). Cualquier uso comercial (revenderlo, usarlo para dictar o vender un curso) requiere permiso explícito del autor, Josué André Bringas Beltrán. No es una licencia "open source" en el sentido estricto de OSI (que exige permitir también el uso comercial) — es "source-available": el código es visible y auditable, pero el uso comercial está reservado.

## Punto de partida

Empieza siempre por [ROUTING.md](ROUTING.md) — es el índice que decide qué otro archivo abrir según la tarea puntual, para no cargar todo el arnés de una vez.
