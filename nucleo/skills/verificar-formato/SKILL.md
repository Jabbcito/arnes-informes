---
name: verificar-formato
description: Verifica estructura y formato APA del documento: numeración de tablas/figuras, secciones, pendientes (con código) + niveles de título y estilo (con lectura contra comun/apa/).
---

## Disparador

Antes de generar índices, y obligatoriamente dentro de `auditar-tesis` antes de exportar.

## Qué hace

1. Verifica primero `node --version` (regla 20 de `../../../AGENTS.md`); si falla, se detiene y sigue las instrucciones de `../../comun/herramientas/README.md`.
2. Ejecuta (hallazgos deterministas):
   ```
   node nucleo/comun/herramientas/verificar_estructura.js --informe output/trabajo/informe.md --salida output/trabajo/reporte-estructura.md
   ```
   Detecta: numeración de tablas/figuras salteada o duplicada, menciones a Tabla/Figura/Anexo inexistentes, marcadores pendientes, secciones faltantes.
3. **Restos de andamiaje (por código o lectura)**: revisar que no queden marcas del proceso en el texto final — frases tipo "[INSTRUCCION", "TODO:", "Lorem", "aquí va", "reemplaza este párrafo", "XX_", o instrucciones de redacción copiadas de los archivos del arnés como si fueran contenido. Si aparece alguna, se corrige o se marca como hallazgo de código.
4. Revisión de lectura (juicio, contra `../../comun/apa/`):
   - Niveles de título consecutivos y con el formato del brief (`../../comun/apa/formato-documento.md`).
   - Tablas/figuras con número, título y nota según el formato elegido (`../../comun/apa/tablas-figuras-apa.md`).
   - Redacción: tercera persona/impersonal, tiempos verbales coherentes por sección.
   - **Uniformidad de estilo**: que las secciones tengan la misma voz y nivel de detalle — si una sección parece redactada por otra voz (párrafos pegados de un chat sin revisar, vocabulario inconsistente, subtítulos con formato distinto), se señala para que el alumno la revise y la haga propia.
5. Reporta separando **hallazgos de código** (objetivos, hay que corregirlos) de **hallazgos de lectura** (se proponen y el alumno decide).

## No hace

No corrige contenido (eso es de `redactar-seccion`); solo estructura y formato. No marca verificación completa con problemas de código abiertos.
