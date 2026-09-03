# LogiFresh | Control de operaciones

Dashboard estático e interactivo para decidir qué investigar antes de proponer un piloto de mejora de 30 días. Datos exclusivamente sintéticos de abril–junio de 2026.

**Estado:** publicado y comprobado en GitHub Pages. [Abrir dashboard](https://marianaog30.github.io/ai-tools-logifresh-OROZCO/) · [Repositorio público](https://github.com/marianaog30/ai-tools-logifresh-OROZCO) · [Reporte de validación](REPORTE_VALIDACION.md).

## Uso

Abrir `index.html` con los archivos auxiliares en la misma carpeta, o servir esta carpeta como sitio estático. Elegir uno o más de los ocho filtros: mes, origen, destino, producto, transportista, tipo de ruta, SLA e incidente. Se combinan por intersección. Restablecer recupera 240 embarques. El selector “Agrupar por” solo cambia la gráfica SLA por segmento.

Los filtros actualizan los ocho KPIs, las cuatro gráficas, el panel de interpretación y la tabla paginada de detalle. Sin resultados, las sumas y conteos son cero; tasas y promedios se muestran como “—”. La información fija de metodología y calidad mantiene el contexto de la fuente completa.

No usa librerías remotas, seguimiento, cookies, claves, servicios de datos ni fuentes externas. Requiere un navegador moderno con JavaScript. Times New Roman se resuelve en el equipo del lector; si no está instalada se usa una tipografía serif local.

## Datos, controles y discrepancia aceptada

Fuente: `Datos_sinteticos_LogiFresh_dashboard.xlsx`, hojas `Datos` y `Diccionario_y_control`. Guía: `Actividad_Work_Cowork_Dashboard_GitHub_Pages_Dra_Elda_C_Morales.docx`. Los originales permanecen fuera del repositorio publicable. Los 240 registros sintéticos convertidos están en `data.js`; no se corrigieron ni inventaron importes.

SHA-256 del Excel: `11fa6c3dbc1cab144af5968f2933f578ce457b54b15d11fc54c6dec9afa0bd6c`.

| Indicador | Resultado | Definición |
|---|---:|---|
| Embarques | 240 | Filas seleccionadas |
| SLA | 76.7% | 184 “Cumple” / 240 |
| Brecha | −13.3 pp | SLA − meta de referencia de 90% |
| Retraso de tardíos | 51.8 min | Promedio únicamente donde retraso_min > 0; n=56 |
| Incidentes | 52 | Categoría distinta de “Sin incidente” |
| Excursiones >8 °C | 9 | Indicador “Sí”, verificado contra temperatura_max_c |
| Reclamaciones | $882,549 MXN | Suma de reclamacion_mxn |
| Satisfacción | 8.5/10 | Promedio simple, n=240 |

La guía y el diccionario esperan **$882,649 MXN**, pero la suma del Excel es **$882,549 MXN**, diferencia **−$100**. Se confirmó con dos vías: lectura de valores y suma decimal directa de las celdas N2:N241 del XML. La usuaria aceptó mostrar la suma fuente y documentar la diferencia; el control original no se declara aprobado sin reservas.

Periodo observado: 2026-04-01 a 2026-06-28, 80 embarques por mes. Actualización del artefacto: 2026-09-02, corte estático sin refresco automático. La hoja de diccionario define 7 de 18 campos; los restantes se usan como etiquetas literales sin inferir contratos ni reglas de cumplimiento.

## Tres hallazgos

1. **Servicio:** el SLA global es 76.7%, 13.3 pp por debajo de la referencia de 90%. Abril y mayo tienen 80/80 cumplimientos cada uno; junio tiene 24/80 (30%). **Acción:** revisar la integridad del registro y los tiempos por etapa de junio antes de seleccionar intervención. **Indicador:** SLA mensual con numerador y denominador.
2. **Cobertura del registro:** los 56 tardíos figuran “Sin incidente”; los 52 incidentes están en abril y en embarques que cumplen. **Acción:** contrastar bitácoras y acordar una clasificación de motivos, sin recodificar el dataset sintético. **Indicador:** proporción de tardíos con motivo validado. **Límite:** no atribuir retrasos a las categorías de incidentes.
3. **Exposición económica:** Preparados concentra $359,900 de $882,549 MXN (40.8%) con 48 embarques. Hay 9 excursiones térmicas en el total, pero su coincidencia con montos no demuestra causalidad. **Acción:** revisar expedientes, valor de carga y estado de reclamaciones. **Indicador:** reclamación por embarque y, cuando exista denominador, por valor transportado.

## Hipótesis por validar

- Los tardíos sin incidente clasificado podrían reflejar cobertura insuficiente del registro; verificar bitácoras y timestamps. El diseño artificial del ejercicio es una explicación alternativa.
- La concentración de reclamaciones en Preparados podría relacionarse con valor transportado o pocos casos severos; solicitar valor, causa validada y estado de pago. No hay evidencia de que el producto cause las reclamaciones.

## Piloto propuesto de 30 días

Propuesta para operaciones reales comparables, sujeta a validación humana; no se ejecuta ni se proyectan resultados usando este conjunto sintético.

- **Días 1–5:** jefatura de operaciones (rol propuesto) valida registros de junio, tiempos por etapa, definición SLA y costo. Selecciona segmento e intervención según causa comprobada; define una línea basal reciente comparable. Junio sintético tiene SLA 30% (24/80), 0 excursiones, $21,299/80 = $266.24 MXN reclamados por embarque; sirve solo de referencia didáctica.
- **Días 6–25:** aplicar la intervención acordada en un grupo y mantener un grupo comparable de referencia; si es factible, asignar aleatoriamente. Registrar exposición, motivos y cumplimiento diariamente.
- **Días 26–30:** evaluar SLA y diferencia del cambio frente al grupo de referencia, con tamaños de muestra e incertidumbre. Criterio propuesto: SLA ≥90% sin aumentar excursiones por 100 embarques ni reclamaciones por embarque frente a línea basal comparable. Si el periodo o la muestra no bastan, ampliar antes de decidir.

Riesgos/datos faltantes: causa raíz validada, tiempos por etapa, condiciones externas, costos, estacionalidad, exposición económica, duración de excursiones, condiciones térmicas específicas por producto, reclamaciones pagadas y tamaños de muestra suficientes. El umbral >8 °C es didáctico: no demuestra seguridad alimentaria ni infracción normativa. No sustenta sanciones ni cambios definitivos de proveedor o ruta.

## Archivos y reproducción

- `index.html`, `styles.css`, `app.js`, `metrics.js`, `data.js`: sitio completo, con rutas relativas.
- `.nojekyll`: evita procesamiento Jekyll cuando se publique desde rama.
- `DISENO.md`: preguntas, diseño previo y decisiones.
- `REPORTE_VALIDACION.md`: pruebas, incidencias, correcciones y estado de publicación.
- `tests/extract_validate.py`: extracción de solo lectura; requiere Python 3 y openpyxl. El Excel original no se distribuye.
- `tests/quality.json`: perfil y celdas fuente con reclamaciones.
- `tests/oracle.json`: resultados esperados calculados independientemente desde el Excel.
- `tests/test_metrics.cjs` y `tests/results.json`: comprobación del motor JavaScript frente al oráculo; solo Node, sin dependencias.

Ejecutar `node tests/test_metrics.cjs` desde esta carpeta para repetir la auditoría numérica. Para volver a extraer, ejecutar `python3 tests/extract_validate.py /ruta/al/archivo.xlsx`; esto regenera datos y resultados esperados, por lo que debe acompañarse de revisión del perfil y controles. No regenerar con datos reales sin una autorización distinta y anonimización.

## Publicación y verificación

La usuaria autorizó expresamente la publicación el 2 de septiembre de 2026. Se creó el repositorio público en la cuenta marianaog30, se subieron exclusivamente los archivos revisados y se activó Pages desde `main` y `/ (root)`, con HTTPS obligatorio.

El primer despliegue [terminó correctamente](https://github.com/marianaog30/ai-tools-logifresh-OROZCO/actions/runs/33710266546) y se verificó el dashboard publicado: los ocho casos del oráculo, filtros combinados, restablecimiento, estado vacío y pantalla de 390 px. Además, ocho destinos HTTP respondieron 200 sin credenciales y coincidieron byte por byte con sus archivos locales. Evidencia: `tests/public-browser-results.json`, `tests/public-resources.json` y capturas `evidence/public-*.png`.

El código funcional validado pertenece al commit `75c8fdc50324651f3155d9dfdc5f3b7c9f02e7f6`. Los commits posteriores incorporan documentación y evidencia; mantienen los mismos cinco archivos de aplicación. El SHA de cada publicación se puede consultar en [Actions](https://github.com/marianaog30/ai-tools-logifresh-OROZCO/actions) y en [el historial de main](https://github.com/marianaog30/ai-tools-logifresh-OROZCO/commits/main/); la entrega final identifica el SHA desplegado tras integrar las evidencias.

Para comprobar recursos públicos: `python3 tests/check_site.py https://marianaog30.github.io/ai-tools-logifresh-OROZCO/`. Esta prueba no utiliza cookies ni credenciales; se complementa con las interacciones reales del navegador. El reporte distingue la validación inicial del sitio de la comprobación del commit final.
