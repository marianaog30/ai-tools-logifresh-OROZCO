# Diseño previo a la construcción

Audiencia: dirección de operaciones. Decisión: seleccionar un segmento y una intervención verificable para un piloto de 30 días. Fuente única: Datos_sinteticos_LogiFresh_dashboard.xlsx, hojas Datos y Diccionario_y_control. Guía: Actividad_Work_Cowork_Dashboard_GitHub_Pages_Dra_Elda_C_Morales.docx.

## Preguntas y representaciones

| Pregunta | Representación | Justificación |
|---|---|---|
| ¿Cómo evoluciona el cumplimiento? | Línea mensual de SLA, escala 0–100%, meta 90% y tabla exacta | Distingue evolución y volumen de cada mes. |
| ¿Dónde priorizar revisión del servicio? | Barras horizontales de SLA por segmento, escala 0–100% y referencia 90% | Compara tasas con denominadores visibles, sin favorecer grupos grandes. |
| ¿Qué incidentes están registrados? | Barras de frecuencia por categoría | Compara conteos desde cero; no atribuye causas. |
| ¿Dónde se concentra el monto reclamado? | Barras por producto, MXN y número de embarques | Identifica exposición económica; no interpreta reclamaciones como pérdida pagada. |

## Jerarquía y comportamiento

1. Propósito, periodo observado, actualización y advertencia de fuente sintética.
2. Incidencia de calidad de $100 entre suma fuente y control, visible y permanente.
3. Ocho filtros: mes, origen, destino, producto, transportista, tipo de ruta, SLA e incidente; intersección lógica y restablecer visible.
4. Ocho KPIs: embarques, SLA, brecha en puntos porcentuales contra meta 90%, retraso solo tardíos, incidentes, excursiones >8 °C, reclamaciones y satisfacción.
5. Cuatro gráficas y panel Hechos/Hipótesis/Próximo paso. Los hechos y el contexto del piloto se recalculan con la selección.
6. Tabla de detalle filtrada, paginada, con expansión de campos restantes. Fuente, definiciones y límites al final.

Times New Roman, rojo oscuro, fondo neutro claro y texto oscuro. Controles nativos, foco visible, títulos semánticos, enlace de salto y valores textuales alternativos a gráficas. En móvil: apilar paneles; confinar desplazamiento horizontal al detalle tabular. Sin datos: conteos/sumas cero y promedios/tasas no definidos, mensaje para restablecer, sin hipótesis del segmento vacío.

## Arquitectura y decisiones

Sitio estático sin dependencias externas: HTML + CSS + JavaScript clásico + datos incorporados en data.js. index.html en raíz; rutas relativas compatibles con subdirectorio de GitHub Pages. Motor de métricas separado para contrastarlo con cálculos independientes en Python y pruebas reproducibles en Node. No requiere instalación, servidor de aplicaciones, cookies, analítica ni credenciales. Los identificadores son sintéticos. El Excel y la guía originales se conservan fuera de la carpeta publicable.

El nombre propuesto es ai-tools-logifresh-OROZCO: los corchetes del encargo se interpretan como delimitadores del apellido.

## Incidencia conocida antes de construir

La suma real es $882,549 MXN; el control exige $882,649 MXN. Confirmada tanto con lectura de celdas como sumando directamente N2:N241 del XML del archivo. No se altera ningún embarque para forzar coincidencia. Se solicita aceptación del valor fuente; el control original permanece marcado como discrepante. Los otros seis controles coinciden.

## Puerta de publicación

Completar construcción, pruebas locales y documentación antes de solicitar aprobación. Crear el repositorio público, subir archivos y habilitar Pages únicamente tras autorización explícita. Las pruebas públicas y el commit desplegado solo se reportarán cuando puedan observarse; una previsualización local no satisface la entrega pública.
