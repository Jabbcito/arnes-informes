# Puente para Claude Code

Este arnés es multi-herramienta (OpenCode, Claude Code, Codex). La fuente única de reglas es **`AGENTS.md`** y la navegación es **`ROUTING.md`** — léelos en ese orden y síguelos como si fueran este archivo.

Las skills viven en `.opencode/skills/<nombre>/SKILL.md` (formato nativo de OpenCode). Aunque no seas OpenCode, ábrelas como documento de instrucciones del paso que vas a ejecutar — son Markdown puro (la tabla de `.opencode/skills/README.md` dice cuál corresponde a cada paso).

Los scripts de `comun/herramientas/` se corren con `node` (JavaScript, sin dependencias) desde cualquier herramienta — así el arnés funciona igual sin importar si el alumno tiene Python instalado.
