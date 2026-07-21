# Herramientas del arnés (scripts deterministas)

**Regla central (regla 17 de `../../AGENTS.md`): la IA nunca hace aritmética estadística "de cabeza".** Todo cálculo se ejecuta con estos scripts (o con SPSS/Jamovi del alumno) y se reporta la salida literal. Los scripts imprimen la fórmula con los valores sustituidos para que el alumno pueda explicar el cálculo en la sustentación.

Requisito: **Node.js** en el PATH de la terminal (sin instalar nada más — `lib-csv.js` y `lib-stats.js` son módulos propios, cero dependencias externas). Se eligió Node y no Python para no depender de si el alumno tiene Python instalado.

## Verificación previa obligatoria (regla 20 de `../../AGENTS.md`)

**No se asume que `node` está disponible.** Que la app de escritorio (OpenCode Desktop, Claude Code, etc.) esté construida sobre cierto runtime no garantiza que ese runtime esté expuesto en el PATH de la terminal donde ella ejecuta comandos — son dos cosas distintas y no verificadas para cada app/versión.

Antes de correr cualquier script de esta carpeta, se corre primero:

```
node --version
```

- **Si responde una versión** (ej. `v20.11.0`): se procede normalmente.
- **Si falla** ("comando no encontrado" o similar): el arnés se detiene ahí, informa al alumno con instrucciones claras — instalar Node.js LTS desde nodejs.org (gratis, ~2 minutos, sin configuración adicional) y reiniciar la terminal — y **nunca** calcula el resultado "a mano" como solución de emergencia (violaría la regla 17: ningún cálculo estadístico se hace de memoria). Si el cálculo es urgente y no se puede instalar Node en el momento, la alternativa es SPSS/Jamovi/Excel para ese cálculo puntual, nunca la IA estimando.

## Cálculo

| Script | Qué calcula | Ejemplo |
|---|---|---|
| `muestra.js` | Tamaño de muestra, población finita/infinita | `node muestra.js --N 120` · `node muestra.js --infinita --e 0.03` |
| `confiabilidad.js` | Alfa de Cronbach (escalas) / KR-20 (dicotómicos) desde el CSV del piloto | `node confiabilidad.js piloto.csv` · `--kr20` |
| `descriptivos.js` | Tablas de frecuencias y cruzadas (variables ya categorizadas) → **Markdown listo para pegar** | `node descriptivos.js datos.csv --frecuencia RS --orden Bajo,Medio,Alto` |
| `descriptivos-numericos.js` | Media, mediana, moda, DE, mín/máx de una variable numérica cruda (sin categorizar) | `node descriptivos-numericos.js datos.csv --columna Edad` |
| `correlacion.js` | Pearson / Spearman con p-valor bilateral (aprox. t) | `node correlacion.js datos.csv --x RS --y RA` |
| `chi-cuadrado.js` | Chi-cuadrado de independencia + V de Cramér sobre una tabla de contingencia | `node chi-cuadrado.js datos.csv --x RS_nivel --y RA_nivel` |
| `prueba-t.js` | t de Student (Welch, muestras independientes) + d de Cohen | `node prueba-t.js datos.csv --grupo Sexo --valor Puntaje` |
| `anova.js` | ANOVA de un factor (3+ grupos) + eta cuadrado | `node anova.js datos.csv --grupo Turno --valor Puntaje` |

Todos los scripts de esta sección aceptan `--salida <ruta>`: además de imprimir en terminal, escriben el mismo bloque de resultado a un archivo (típicamente en `output/trabajo/`) para copiarlo de ahí a `informe.md` — nunca retipeado de memoria de lo que se vio en la terminal (regla 29 de `../../AGENTS.md`, fidelidad de datos).

Formato de los CSV: encabezado en la primera fila; cada fila un caso; separador coma; UTF-8. El parser (`lib-csv.js`) soporta campos entre comillas, pero no saltos de línea dentro de un campo.

## Verificación

| Script | Qué comprueba | Ejemplo |
|---|---|---|
| `verificar_citas.js` | Toda cita tiene referencia y viceversa; fuentes citadas están VERIFICADA; textuales con página | `node verificar_citas.js --informe output/trabajo/informe.md --investigacion fuentes/investigacion.md --salida output/trabajo/reporte-citas.md` |
| `verificar_estructura.js` | Numeración de tablas/figuras correlativa; menciones a Tabla/Figura/Anexo inexistentes; marcadores pendientes; secciones presentes | `node verificar_estructura.js --informe output/trabajo/informe.md --salida output/trabajo/reporte-estructura.md` |

## Búsqueda y exportación

| Script | Qué hace | Ejemplo |
|---|---|---|
| `descargar_fuente.js` | Descarga una fuente (PDF/HTML) a disco para leerla completa, no solo su resumen de buscador | `node descargar_fuente.js <url> --salida fuentes/pdfs/nombre` |
| `generar_instrumento_html.js` | Genera una versión HTML imprimible del instrumento (`instrumento.md` → encuesta física con casillas) | `node generar_instrumento_html.js output/trabajo/instrumento.md --salida output/entregables/instrumento.html --universidad "..." --carrera "..." --autor "..."` |

Ambos devuelven código de salida 1 si hay problemas (útil para la skill `auditar-tesis`).

## Inicialización del proyecto

| Script | Qué hace | Ejemplo |
|---|---|---|
| `inicializar_proyecto.js` | Crea (si faltan) `insumos/`, `fuentes/`, `fuentes/pdfs/`, `anexos/imagenes/`, `output/trabajo/`, `output/entregables/` — idempotente, no toca nada que ya exista | `node inicializar_proyecto.js` |

Se corre una sola vez al empezar un proyecto (ver "Primer paso, siempre" en `../../AGENTS.md`), pero correrlo de más no hace daño.

## Límite honesto

- Los verificadores son deterministas pero no infalibles: detectan errores de correspondencia y formato mecánico; **no** pueden juzgar si una paráfrasis es fiel a su fuente ni si el formato fino APA de cada referencia (cursivas, DOI) es perfecto — eso queda en la revisión del alumno guiada por `../apa/`.
- Para estadística que exige software especializado y **sigue derivada a SPSS/Jamovi a propósito**: pruebas de normalidad exactas (Shapiro-Wilk, Kolmogórov-Smirnov), pruebas basadas en rangos (Wilcoxon, U de Mann-Whitney, Kruskal-Wallis), t de Student pareada, comparaciones post-hoc de ANOVA (Tukey, Bonferroni), y regresiones. La razón no es que sean "más difíciles" matemáticamente que lo que ya está en código — es que un error de implementación en una prueba basada en rangos o en una aproximación de normalidad es mucho más difícil de detectar a simple vista que un error en un chi-cuadrado o una t; el costo de un bug silencioso ahí supera el beneficio de tenerlas en código propio. `../formulas/elegir-diseno.md` indica qué corresponde a cada diseño.
- Los scripts que sí calculan (`muestra.js`, `confiabilidad.js`, `correlacion.js`, `chi-cuadrado.js`, `prueba-t.js`, `anova.js`, `descriptivos-numericos.js`) fueron probados contra ejemplos con resultado exactamente conocido: tamaño de muestra contra la fórmula clásica; alfa de Cronbach verificado a mano; Spearman/Pearson exactos en datos monotónicos; chi-cuadrado contra un ejemplo de manual (χ²=16.667, gl=1); t de Welch contra el dataset `sleep` de R (t=-1.861, gl=17.78, medias exactas); ANOVA contra el dataset `PlantGrowth` de R (F=4.846, p=0.0159, exacto); descriptivos numéricos contra un cálculo a mano. Los verificadores de citas/estructura se probaron contra un informe con errores sembrados y los detectaron todos. Ante cualquier discrepancia con SPSS, manda SPSS y se reporta la diferencia al docente.
