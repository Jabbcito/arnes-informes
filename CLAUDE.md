# Puente para Claude Code

Este arnés es multi-herramienta (OpenCode, Claude Code, Codex). La fuente única de reglas es **`AGENTS.md`** y la navegación es **`ROUTING.md`** — léelos en ese orden y síguelos como si fueran este archivo.

Las skills viven en `nucleo/skills/<nombre>/SKILL.md` — una sola carpeta neutra, no `.claude/skills/`. Ábrelas como documento de instrucciones normal del paso que vas a ejecutar (la tabla de `nucleo/skills/README.md` dice cuál corresponde a cada paso de `ROUTING.md`).

Los scripts de `nucleo/comun/herramientas/` se corren con `node` (JavaScript, sin dependencias) desde cualquier herramienta — así el arnés funciona igual sin importar si el alumno tiene Python instalado.
