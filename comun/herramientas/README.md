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
| `descriptivos.js` | Tablas de frecuencias y cruzadas → **Markdown listo para pegar** | `node descriptivos.js datos.csv --frecuencia RS --orden Bajo,Medio,Alto` |
| `correlacion.js` | Pearson / Spearman con p-valor bilateral (aprox. t) | `node correlacion.js datos.csv --x RS --y RA` |

Formato de los CSV: encabezado en la primera fila; cada fila un caso; separador coma; UTF-8. El parser (`lib-csv.js`) soporta campos entre comillas, pero no saltos de línea dentro de un campo.

## Verificación

| Script | Qué comprueba | Ejemplo |
|---|---|---|
| `verificar_citas.js` | Toda cita tiene referencia y viceversa; fuentes citadas están VERIFICADA; textuales con página | `node verificar_citas.js --informe output/trabajo/informe.md --investigacion fuentes/investigacion.md --salida output/trabajo/reporte-citas.md` |
| `verificar_estructura.js` | Numeración de tablas/figuras correlativa; menciones a Tabla/Figura/Anexo inexistentes; marcadores pendientes; secciones presentes | `node verificar_estructura.js --informe output/trabajo/informe.md --salida output/trabajo/reporte-estructura.md` |

Ambos devuelven código de salida 1 si hay problemas (útil para la skill `auditar-tesis`).

## Límite honesto

- Los verificadores son deterministas pero no infalibles: detectan errores de correspondencia y formato mecánico; **no** pueden juzgar si una paráfrasis es fiel a su fuente ni si el formato fino APA de cada referencia (cursivas, DOI) es perfecto — eso queda en la revisión del alumno guiada por `../apa/`.
- Para estadística que exige software especializado (Shapiro-Wilk exacto, t de Student pareada, ANOVA, chi-cuadrado, regresiones): usar **SPSS o Jamovi (gratuito)** y pegar el resultado real. `../formulas/elegir-diseno.md` indica qué corresponde a cada diseño. `correlacion.js` sirve además como contraste del resultado de SPSS.
- Estos scripts fueron probados con datos sintéticos de resultado conocido (tamaño de muestra contra la fórmula clásica, alfa de Cronbach verificado a mano, Spearman/Pearson exactos en datos monotónicos, y los verificadores contra un informe con 4 errores sembrados — los detectaron los 4). Ante cualquier discrepancia con SPSS, manda SPSS y se reporta la diferencia al docente.
