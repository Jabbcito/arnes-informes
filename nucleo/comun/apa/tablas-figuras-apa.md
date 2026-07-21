---
tema: Tablas y figuras en APA 7
fuente: Guía Normas APA 7ª edición (normas-apa.org)
---

# Tablas y figuras — formato APA 7

Este es el formato POR DEFECTO del arnés. La alternativa "formato universidad" (observado en tesis UCV/UPAO) se elige en el brief; las reglas operativas comunes (numeración, datos reales, interpretación) están en `../../tesis/contenido/tablas-y-figuras.md`.

## Componentes de una tabla APA

```
**Tabla 1**                        ← número en NEGRITA, primera línea
*Título breve y descriptivo*      ← título en CURSIVA, línea siguiente, doble espacio

[encabezados de columna]
[cuerpo de la tabla]

*Nota.* Aclaraciones, abreviaturas, atribución de derechos.   ← solo si es necesaria
```

- Numerar en el orden en que se mencionan en el texto.
- Encabezados de columna siempre; texto de encabezados centrado.
- Cuerpo: interlineado sencillo, 1.5 o doble (el más legible); celdas centradas o a la izquierda si mejora la lectura.
- Número, título y nota: alineados a la izquierda sin sangría, con doble espacio.

## Bordes (regla distintiva de APA)

- **Solo bordes horizontales**: arriba de la tabla, abajo de la tabla, debajo de los encabezados de columna (y encima de totales si hay).
- **Nunca** bordes verticales, ni cuadrícula completa alrededor de cada celda.

## Tablas largas o anchas

- Más larga que una página → repetir la fila de encabezados en cada página.
- Más ancha que la página → orientación horizontal de esa página.

## Ubicación y mención

- Incrustada tras su primera mención en el texto (opción usada en tesis), o todas juntas después de Referencias (opción APA alternativa).
- Se citan **por número**: "como se observa en la Tabla 3" — nunca "la tabla de abajo" ni "la tabla de la página 12".

## Figuras (todo lo visual que no es tabla: gráficos, fotos, diagramas, mapas)

Mismo esquema: **Figura N** en negrita → título en *cursiva* debajo → imagen → leyenda dentro de la figura (explica símbolos) → *Nota.* solo si es necesaria. Numeración propia, independiente de las tablas. Antes de insertar una figura: ¿aporta de verdad o duplica una tabla? Si duplica, no va.

## En Markdown (para este arnés) — sintaxis con caption nativo

```markdown
| Nivel | f | % | % válido | % acumulado |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

Table: **Tabla 4.** *Frecuencias de la variable rendimiento académico*

*Nota.* Elaboración propia a partir del cuestionario aplicado (n = 60).
```

Se escribe `Table: **Tabla N.** *Título*` **debajo** de la tabla en el Markdown (así es la sintaxis de caption de Pandoc), pero **en el DOCX exportado aparece arriba de la tabla** automáticamente — coincide con lo que pide APA (número y título antes de la tabla), no hace falta reordenar nada a mano. **Verificado:** la negrita del número y la cursiva del título se conservan correctamente al exportar; el número ("Tabla 4.") se escribe a mano y lo valida `../herramientas/verificar_estructura.js`, Pandoc no lo autonumera.

Para figuras, el caption va en el texto alternativo de la imagen: `![**Figura 1.** Descripción](ruta)`.

La conversión a bordes APA (solo horizontales) se resuelve en la plantilla de exportación (`../exportacion/exportar-word.md`), que define el estilo de tabla del DOCX — el Markdown no necesita simular los bordes.
