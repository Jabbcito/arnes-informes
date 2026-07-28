---
seccion: Levantamiento de observaciones (después de sustentar)
aplica_a: tesis
---

# Levantamiento de observaciones — después de la sustentación

El flujo principal del arnés termina en la exportación y las slides de sustentación. Este es el paso **posterior**, opcional, para cuando el jurado o el asesor piden cambios después de sustentar — algo que pasa en la mayoría de tesis reales (pocas se aprueban sin ninguna observación).

## Disparador

El alumno ya sustentó y trae observaciones reales del jurado/asesor (un acta, una lista escrita, o lo que le dijeron verbalmente y anotó).

## Qué hace

1. **Registrar las observaciones reales**, tal como las dio el jurado — en `output/trabajo/observaciones-jurado.md`, una por una, con la sección/página a la que aplica cada una. Nunca se resumen ni se reinterpretan las observaciones: se transcriben tal cual las dio el jurado, y si alguna no queda clara, se le pregunta al alumno qué entendió antes de aplicar un cambio.
2. **Aplicar cada observación solo a la sección afectada** — no se regenera la tesis completa. Si el jurado pidió "profundizar la discusión del objetivo 2" y "corregir una cita en el marco teórico", se editan solo esas dos partes, y ninguna otra.
3. Marcar cada observación como `Pendiente` / `Aplicada` en `output/trabajo/observaciones-jurado.md` a medida que se resuelven, para llevar registro de cuáles faltan.
4. Cuando todas están `Aplicada`, correr de nuevo `auditar-tesis` (no se salta el gate solo porque ya se sustentó una vez) antes de reexportar.
5. **Distinguir versión de sustentación de versión final**: la que se exportó antes de sustentar queda tal cual en `output/entregables/` (no se sobrescribe sin avisar) — la nueva exportación, ya con las observaciones levantadas, se guarda como la versión final (ej. `informe-final.docx` en vez de `informe.docx`, o el nombre que la universidad exija para el ejemplar definitivo). El alumno decide el nombre exacto según lo que le pida su universidad para el depósito final.

## No hace

No decide por su cuenta si una observación del jurado es válida o no — todas se registran y se aplican (o se le pregunta al alumno si alguna le parece que no corresponde, para que él lo consulte con su asesor, nunca el arnés decidiendo ignorarla). No reexporta sobrescribiendo la versión de sustentación sin que el alumno lo confirme.
