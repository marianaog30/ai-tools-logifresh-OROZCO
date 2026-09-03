# Reporte de validación — LogiFresh

**Estado: validado localmente; publicación pendiente.** No se ha creado el repositorio público ni activado GitHub Pages. La aprobación de publicación y una sesión autenticada de GitHub siguen pendientes. No se declara una URL ni un commit desplegado inexistentes.

## Fuente y procedimiento

Fuente exclusiva: `Datos_sinteticos_LogiFresh_dashboard.xlsx`, `Datos!A1:R241` y `Diccionario_y_control`. Fecha de revisión: 2026-09-02, zona America/Mexico_City. Periodo fuente: 2026-04-01–2026-06-28. Guía: `Actividad_Work_Cowork_Dashboard_GitHub_Pages_Dra_Elda_C_Morales.docx`.

SHA-256 original: `11fa6c3dbc1cab144af5968f2933f578ce457b54b15d11fc54c6dec9afa0bd6c`.

Secuencia: inventario y diccionario → perfil → reconciliación independiente → preguntas y diseño en `DISENO.md` → construcción → pruebas de motor y navegador → correcciones → documentación → aprobación → publicación y nueva verificación pública (últimas dos etapas pendientes).

El motor JavaScript se contrastó contra un oráculo calculado con Python desde el Excel. Se verificaron además los valores renderizados en el navegador, sin invocar las funciones internas del sitio como sustituto de interacción. Los selectores se operaron mediante los controles visibles. La vista previa autorizada está limitada a 127.0.0.1 y a la carpeta de este proyecto; no es un sitio público.

## Perfil de calidad

| Revisión | Obtenido | Resultado |
|---|---|---|
| Granularidad | Un embarque por fila; 240 filas y 18 campos | Conforme |
| ID | 240 identificadores únicos | Conforme |
| Duplicados exactos | 0 | Conforme |
| Nulos | 0 en cada uno de los 18 campos | Conforme |
| Periodo | Abril, mayo y junio: 80 filas cada mes; fin 28 de junio | Conforme al corte observado |
| SLA/retraso | 0 contradicciones: “Cumple” equivale a retraso cero en este archivo | Conforme |
| Excursión/temperatura | 0 contradicciones entre “Sí” y temperatura >8 °C | Conforme |
| Satisfacción | Valores 8–9, dentro de 1–10 | Conforme |
| Ocupación | 0.82–0.98, dentro de 0–1 | Conforme |
| Diccionario | 7 campos definidos de 18 | Límite documentado |
| Fórmulas en hoja Datos | 0; valores almacenados | Sin dependencia de caché de fórmulas |
| Montos | 15 reclamaciones positivas; resto cero | Suma comprobada por dos vías |

Rangos restantes: tránsito 6–24 h, retraso 0–79 min, temperatura máxima 3.2–12 °C, reclamación 0–145,000 MXN, distancia 520–2,997 km. No se aplicó eliminación de atípicos, imputación ni recodificación. Los rangos son observaciones, no reglas de validez contractual.

## Matriz de aceptación numérica

| Prueba | Esperado según encargo | Obtenido en datos y navegador | Estado |
|---|---:|---:|---|
| Embarques | 240 | 240 | PASS |
| SLA | 76.7% | 184/240 = 76.6667% → 76.7% | PASS |
| Meta y brecha | Meta 90%, brecha visible | −13.3 pp | PASS |
| Retraso solo tardíos | 51.8 min | 51.8 min; n=56 | PASS |
| Incidentes | 52 | 52 | PASS |
| Excursiones >8 °C | 9 | 9 | PASS |
| Reclamaciones | $882,649 MXN | **$882,549 MXN** | **DISCREPANCIA ACEPTADA**, no coincidencia literal |
| Satisfacción | 8.5/10 | 8.5/10 | PASS |

Frecuencias de incidentes comprobadas: falla mecánica 14, ventana de entrega 12, temperatura 9, documentación 9 y tráfico 8; suman 52. “Sin incidente”: 188.

### Incidencia de $100

Dos vías independientes coinciden: suma de valores leídos de la hoja y suma con aritmética decimal de N2:N241 directamente desde el XML del archivo. Resultado $882,549 MXN. Las 15 celdas positivas y sus valores están en `tests/quality.json`.

La usuaria respondió **“Sí”** a mostrar $882,549 y documentar la diferencia, sin modificar la fuente. Este permiso acepta el tratamiento del dato; **no es autorización de publicación**. No se añadió una reclamación ficticia ni se ajustó una fila para alcanzar el control. La causa exacta de la diferencia entre guía y fuente permanece desconocida.

## Pruebas de interacción en navegador

En cada caso del oráculo se contrastaron los ocho KPIs, valores por categoría de las tres gráficas de barras, evolución mensual, número de filas mostradas, pertenencia de IDs al subconjunto y contexto de Hechos/Hipótesis/Próximo paso. Los paneles de interpretación cambian con los filtros; no se trata de textos generales que conserven las cifras originales.

| Prueba | Esperado | Obtenido | Estado |
|---|---|---|---|
| Sin filtros | 240, SLA 76.7%, $882,549 | Coincide | PASS local |
| Individual: abril | 80; SLA 100%; sin tardíos; 52 incidentes; 9 excursiones; $762,150; satisfacción 8.5 | Coincide; retraso “—” | PASS local |
| Combinados: abril + Preparados | 16; SLA 100%; 10 incidentes; 2 excursiones; $319,600; satisfacción 8.5 | Coincide en KPIs, gráficas, interpretación y 16 filas | PASS local |
| Restablecer | 240 y todos los controles originales | Coincide; página 1 | PASS local |
| Sin resultados: CDMX + Centro | 0 filas; conteos y suma cero; tasas/promedios “—”; mensaje claro | Coincide en todos los componentes | PASS local |
| SLA: No cumple | 56; SLA 0%; retraso 51.8; 0 incidentes; 0 excursiones; $10,899 | Coincide | PASS local |
| Incidente: Temperatura | 9; SLA 100%; 9 excursiones; $92,300; satisfacción 8.4 | Coincide | PASS local |
| Destino: Mérida | 30; SLA 76.7%; retraso 55.9; 7 incidentes; 1 excursión; $84,900; satisfacción 8.0 | Coincide | PASS local |
| Tipo de ruta: Estándar | 80; SLA 76.3%; retraso 55.6; 17 incidentes; 3 excursiones; $443,749; satisfacción 8.5 | Coincide | PASS local |
| Agrupar SLA por transportista | 4 grupos; 46/60 = 76.7% cada uno | Coincide | PASS local |
| Paginación | Siguiente → página 2; Anterior → página 1 | 2/12 y 1/12 | PASS local |
| Teclado | Tab desde Mes lleva a Origen, foco visible | f-origen; contorno sólido visible | PASS local |
| Etiquetas | 9 selectores con etiqueta asociada | 9/9 | PASS local |
| Vista escritorio | Sin desbordamiento de página; tarjetas legibles | Verificado a 1280 px y 1440 px | PASS local |
| Vista móvil | 390 px sin desbordamiento de página | ancho documento 390; tabla 1000 dentro de contenedor de 316 | PASS local |
| Consola | Sin errores ni advertencias del sitio | 0 observados durante pruebas | PASS local |
| Recursos y enlaces locales | HTTP 200 y contenido igual a archivos locales | 8 destinos correctos, incluidos README y reporte | PASS local |
| URL pública y recursos | HTTPS sin autenticación, recursos correctos | Sin publicación | **PENDIENTE** |
| Commit desplegado | Coincide con commit final del repositorio | Sin despliegue | **PENDIENTE** |

## Pruebas reproducibles y accesibilidad

`node tests/test_metrics.cjs` pasó **2,740 comparaciones**, con **8 casos del oráculo** y **97 combinaciones/opciones de filtros**. Verifica todos los grupos por ocho dimensiones y conservación de filas y MXN, además de casos vacíos. Archivos de evidencia: `tests/oracle.json`, `tests/results.json`, `tests/browser-results.json` y `tests/quality.json`. `tests/check_site.py` comprueba recursos y coincidencia byte a byte; resultado local en `tests/local-resources.json`.

Accesibilidad básica: idioma es-MX, encabezados semánticos, enlace de salto, controles nativos, etiquetas, foco visible, región de estado para el resultado de filtros, tablas con encabezados y alternativa textual a la tendencia. Las tasas, estados y referencias incluyen texto y no dependen solo del color. No se realizó una auditoría completa con lector de pantalla; no se declara conformidad WCAG integral.

Contrastes calculados para los pares principales: texto/fondo 15.42:1; texto secundario/fondo 6.65:1; rojo/fondo 8.87:1; texto blanco/tarjeta SLA 13.17:1; nota/tarjeta SLA 10.42:1; texto/panel interpretativo 12.70:1. Todos superan 4.5:1 para texto normal en los pares revisados.

Carga inicial: **130,112 bytes sin compresión** entre HTML, CSS, datos y los dos scripts de lógica. Cero referencias HTTP externas en estos recursos. No se infiere de este tamaño una latencia de red ni una puntuación de rendimiento: faltan mediciones desde la URL pública. Capturas y pruebas no se cargan al abrir el dashboard.

## Evidencia visual

- `evidence/desktop.png`: vista de escritorio sin filtros.
- `evidence/two-filters.png`: abril + Preparados.
- `evidence/mobile.png`: encabezado y filtros a 390 px.
- `evidence/mobile-kpis.png`: indicadores y comienzo de tendencia a 390 px.

Son capturas **locales**; no acreditan GitHub Pages. La tabla de detalle limita el desplazamiento horizontal a su propio contenedor.

## Bitácora y correcciones

| Resultado inicial / incidencia | Acción | Resultado final |
|---|---|---|
| Reclamaciones no coincide con control | Segunda lectura XML, identificación de celdas y consulta a usuaria | Valor fuente aceptado y discrepancia visible |
| Riesgo de reutilizar cifras de otro LogiFresh en la carpeta | Analizar únicamente el Excel solicitado | Base y definiciones de 240 embarques |
| Servidor local bloqueado por sandbox | Solicitar aprobación para vista temporal solo en 127.0.0.1 | Autorización recibida; servidor de prueba disponible |
| Apertura directa de archivo bloqueada por navegador | Usar la vista local autorizada, limitada a la carpeta | Verificación por HTTP local |
| Localizador por etiqueta exacta no encontraba el selector | Revisar estructura visible y utilizar rol y nombre accesible | Interacción y comprobaciones completas |
| Capturas con recorte o repetición durante cambios de tamaño | Revisar navegador visible y repetir capturas tras estabilizar la vista | Evidencia de escritorio y móvil revisada |
| Encabezado abreviado “02 · 2026” ambiguo | Cambiar por “ABR–JUN 2026” | Periodo explícito |

## Hallazgos, decisiones y límites

Ver `README.md` para tres hallazgos con acciones e indicadores, dos hipótesis y el piloto de 30 días. La prioridad exploratoria es la caída de junio (30% SLA), con cautela por el origen sintético y los tardíos sin causa clasificada. Preparados concentra 40.8% del monto; eso no prueba responsabilidad ni causalidad.

Antes de una decisión real faltan causas validadas, tiempos por etapa, condiciones externas, costo y viabilidad de intervención, valor de carga, exposición, duración térmica y estado de reclamaciones. La meta del piloto es propuesta, no resultado predicho.

## Pendientes de publicación

1. Autorización explícita para crear `ai-tools-logifresh-OROZCO` público, subir esta carpeta y activar Pages.
2. Acceso autenticado a la cuenta de GitHub. El navegador disponible estaba sin sesión; no se encontró herramienta GitHub conectada ni CLI GitHub instalada.
3. Crear repositorio sin sobrescribir proyectos existentes; registrar commit de contenido.
4. Configurar Pages, esperar despliegue y comprobar la URL pública, recursos, filtros y móvil.
5. Registrar URL del sitio, URL del repositorio y SHA desplegado; actualizar este reporte con evidencia pública.

**Criterio de cierre:** el trabajo no está terminado mientras la publicación, prueba pública y correspondencia de commit sigan pendientes.
