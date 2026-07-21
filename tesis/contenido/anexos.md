---
seccion: Anexos
aplica_a: tesis
---

# Anexos

Patrón estándar observado en las tesis reales (el orden y la cantidad varían según la universidad, pero estos son los recurrentes):

| Anexo | Contenido | Quién lo produce |
|---|---|---|
| 1 | **Matriz de consistencia** (ver `matriz-de-consistencia.md`) | El arnés, desde `trabajo/matriz-consistencia.md` |
| 2 | **Matriz/tabla de operacionalización de variables** (versión completa, con ítems) | El arnés, desde Metodología 3.2 |
| 3 | **Instrumento(s) de recolección** — el cuestionario/ficha completo, con instrucciones y escala | El arnés arma la estructura; el alumno valida cada ítem |
| 4 | **Prueba de confiabilidad** — resultados del piloto (ej. capturas/tablas de SPSS con alfa de Cronbach) | El alumno (datos reales de su piloto); el arnés solo da formato |
| 5 | **Validación por juicio de expertos** — matrices/fichas firmadas por los expertos | Humanos reales — el arnés deja `[PENDIENTE: FICHAS FIRMADAS POR EXPERTOS]` |
| 6 | **Cartas y autorizaciones** — permiso de la institución donde se aplicó el estudio | Humanos reales — `[PENDIENTE: CARTA/AUTORIZACIÓN]` |
| 7 | **Reporte de similitud Turnitin** | Se corre sobre el documento final — `[PENDIENTE: REPORTE TURNITIN]` (regla 11 de `../../AGENTS.md`) |
| + | Evidencia adicional que pida la rúbrica: fotos, tablas extensas, organigramas, informes intermedios | Según el caso |

## Anexos con imágenes (escaneos, pantallazos, cartas)

Convención de carpeta en el proyecto del alumno:

```text
mi-tesis/
└── anexos/
    ├── imagenes/                       ← todo lo que es imagen
    │   ├── anexo-04-confiabilidad-spss.png
    │   ├── anexo-05-ficha-experto-1.jpg
    │   └── anexo-06-carta-autorizacion.png
    └── (anexos textuales van directo en informe.md como Markdown)
```

- Nombrar: `anexo-NN-descripcion.ext` (el NN coincide con el número del anexo).
- Insertar en `trabajo/informe.md` con ruta relativa para que Pandoc la incruste en el DOCX:
  `![Ficha de validación del experto 1](../anexos/imagenes/anexo-05-ficha-experto-1.jpg)`
- Legibilidad mínima: el texto de la imagen debe leerse a zoom 100% en el PDF final; escaneos torcidos o borrosos se rehacen, no se entregan.
- Clasificación por tipo: **anexo-tabla** (Markdown: matriz de consistencia, operacionalización), **anexo-imagen** (archivo en `anexos/imagenes/`), **anexo-documento externo** (PDF aparte que se adjunta al final del PDF exportado — se menciona en el cuerpo y se une con las herramientas de PDF al armar la entrega).

## Reglas

1. Cada anexo se numera y titula, y **se referencia desde el cuerpo** ("ver Anexo 3") — un anexo que nada del texto menciona sobra, y una mención a un anexo que no existe es un error (`../../comun/herramientas/verificar_estructura.js` lo detecta).
2. Los anexos que dependen de firmas, autorizaciones o reportes de software externos **nunca se simulan**: se deja la plantilla con el marcador `[PENDIENTE: ...]` correspondiente.
3. El orden final de los anexos lo define la rúbrica/formato de la universidad del alumno; esta tabla es el punto de partida.
