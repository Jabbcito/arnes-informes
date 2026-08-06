---
name: auditar-tesis
description: Auditoría integral pre-exportación. Corre todas las verificaciones en orden y actualiza checklist-final.md. exportar-entrega no procede sin esta auditoría en verde.
---

## Disparador

Cuando el alumno cree que la tesis está lista para exportar. Es el paso previo obligatorio a `exportar-entrega` (regla 16 de `../../../AGENTS.md`).

## Qué hace (en orden; se detiene y reporta en el primer bloque con problemas)

1. **Matriz de consistencia cuadrada**: misma cantidad y orden de problemas/objetivos/hipótesis específicos, mismas variables con los mismos nombres en título, matriz, metodología y conclusiones (`../../tesis/contenido/matriz-de-consistencia.md`).
2. **Objetivos confirmados**: los objetivos general y específicos fueron elegidos por el alumno entre opciones (regla 22), no fijados directamente.
3. **Instrumento validado**: alfa de Cronbach ≥0.70 (o el umbral del brief) calculado por `../../comun/herramientas/confiabilidad.js` sobre un piloto real, registrado en Metodología 3.4 (regla 21, `../../tesis/contenido/instrumento-y-muestra.md`).
4. **Datos principales reales**: Resultados se redactó a partir de `output/trabajo/datos-principales.csv` (instrumento aplicado a toda la muestra), no del CSV del piloto ni de datos de relleno (regla 26, `../../tesis/contenido/recoleccion-datos-principal.md`).
5. **Citas**: skill `verificar-citas` (código + revisión) → sin PROBLEMAS.
6. **Formato/estructura**: skill `verificar-formato` (código + lectura) → sin PROBLEMAS de código. Incluye la detección de **restos de andamiaje** (texto de instrucción/placeholder del arnés que quedó en el documento) y la **uniformidad de redacción** entre secciones (que ninguna sección parezca pegada de un chat sin revisar).
7. **Coherencia estadística**: la prueba usada coincide con el diseño declarado y con el resultado real de normalidad (`../../comun/formulas/elegir-diseno.md`); toda cifra reportada tiene su salida de script o de SPSS pegada por el alumno.
8. **Dedicatoria y Agradecimiento**: no quedan `[PENDIENTE: A QUIÉN VA LA DEDICATORIA]` / `[PENDIENTE: A QUIÉN VA EL AGRADECIMIENTO]` (ambos son bloqueantes, a diferencia de las firmas — sí se pueden resolver antes de exportar con solo preguntarle al alumno).
9. **Anexos**: cada anexo existe, está numerado y referenciado desde el cuerpo; los que dependen de firmas/reportes externos están correctamente marcados `[PENDIENTE: ...]` (esos NO bloquean la auditoría, son responsabilidad humana posterior — pero se listan en el resultado).
10. **Título**: sigue describiendo exactamente lo que la tesis terminó siendo; la verificación de disponibilidad está registrada en `output/trabajo/verificacion-titulo.md`.
11. **Sin `[EVIDENCIA PENDIENTE]`** en el cuerpo (los `[PENDIENTE: firma/Turnitin]` de declaratorias y anexos son los únicos aceptables).
12. **Revisión visual final en Word real** (no solo LibreOffice, que es lo único que este arnés puede probar automáticamente): el alumno abre el DOCX exportado en su propia instalación de Microsoft Word y revisa con sus propios ojos — en particular, cualquier tabla larga que se corte entre dos páginas (que quede legible, con el encabezado repetido) y que estilos/numeración se vean igual que en la vista previa. Este punto queda marcado `[PENDIENTE: REVISIÓN EN WORD REAL]` hasta que el alumno confirme que lo hizo — es un chequeo humano, no algo que el arnés pueda verificar por código.
13. Actualiza `output/trabajo/checklist-final.md` con el resultado de cada punto (✓/✗ + detalle).

## Salida

`output/trabajo/checklist-final.md` actualizado + resumen para el alumno: qué está en verde, qué falta y quién lo resuelve (arnés / alumno / humano externo).

## No hace

No exporta. No marca en verde un punto con problemas abiertos "porque son menores". No cuenta los pendientes de firma/Turnitin como resueltos.
