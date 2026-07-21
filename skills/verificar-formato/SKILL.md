---
name: verificar-formato
description: Verifica estructura y formato APA del documento: numeración de tablas/figuras, secciones, pendientes (con código) + niveles de título y estilo (con lectura contra comun/apa/).
---

## Disparador

Antes de generar índices, y obligatoriamente dentro de `auditar-tesis` antes de exportar.

## Qué hace

1. Verifica primero `node --version` (regla 20 de `../../AGENTS.md`); si falla, se detiene y sigue las instrucciones de `../../comun/herramientas/README.md`.
2. Ejecuta (hallazgos deterministas):
   ```
   node comun/herramientas/verificar_estructura.js --informe trabajo/informe.md --salida trabajo/reporte-estructura.md
   ```
   Detecta: numeración de tablas/figuras salteada o duplicada, menciones a Tabla/Figura/Anexo inexistentes, marcadores pendientes, secciones faltantes.
3. Revisión de lectura (juicio, contra `../../comun/apa/`):
   - Niveles de título consecutivos y con el formato del brief (`../../comun/apa/formato-documento.md`).
   - Tablas/figuras con número, título y nota según el formato elegido (`../../comun/apa/tablas-figuras-apa.md`).
   - Redacción: tercera persona/impersonal, tiempos verbales coherentes por sección.
4. Reporta separando **hallazgos de código** (objetivos, hay que corregirlos) de **hallazgos de lectura** (se proponen y el alumno decide).

## No hace

No corrige contenido (eso es de `redactar-seccion`); solo estructura y formato. No marca verificación completa con problemas de código abiertos.
