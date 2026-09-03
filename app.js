/* Una única selección alimenta todas las vistas. Sin solicitudes externas. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  if (!Array.isArray(window.LOGIFRESH_DATA) || !window.LogiFresh) { $('load-error').hidden = false; return; }
  const data = window.LOGIFRESH_DATA;
  const { filter, metrics, group, value } = window.LogiFresh;
  const dimensions = {mes:'Mes',origen:'Origen',destino:'Destino',producto:'Producto',transportista:'Transportista',tipo_ruta:'Tipo de ruta',sla_entrega:'SLA',tipo_incidente:'Incidente'};
  const months = {'2026-04':'Abril','2026-05':'Mayo','2026-06':'Junio'};
  const fmt = (n, digits=0) => n === null ? '—' : n.toLocaleString('es-MX',{minimumFractionDigits:digits,maximumFractionDigits:digits});
  const money = n => '$'+fmt(n);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const date = s => s.split('-').reverse().join('/');
  let selected = data, page = 1;
  let filters = {};
  const pageSize = 20;
  $('filter-inputs').innerHTML = Object.entries(dimensions).map(([key,label])=>`<label for="f-${key}">${label}<select id="f-${key}" name="${key}"><option value="">Todos</option>${[...new Set(data.map(r=>value(r,key)))].sort().map(v=>`<option value="${esc(v)}">${esc(months[v]||v)}</option>`).join('')}</select></label>`).join('');
  $('filters').addEventListener('submit',e=>e.preventDefault());
  $('filters').addEventListener('change',()=>{filters=Object.fromEntries(Object.keys(dimensions).map(k=>[k,$('f-'+k).value]));page=1;render();});
  $('reset').addEventListener('click',()=>{$('filters').reset();filters={};page=1;render();});
  $('segment').addEventListener('change',renderSegments);
  $('prev').addEventListener('click',()=>{page=Math.max(1,page-1);renderTable();});
  $('next-page').addEventListener('click',()=>{page=Math.min(Math.ceil(selected.length/pageSize),page+1);renderTable();});

  function kpi(key,label,val,unit,note,primary=false) {
    return `<article class="kpi${primary?' primary':''}" data-kpi="${key}"><span class="label">${label}</span><strong class="value">${val}${unit?` <span class="unit">${unit}</span>`:''}</strong><span class="note">${note}</span></article>`;
  }
  function bars(items, max, isSla=false) {
    return items.map(r=>`<div class="bar-row"><div class="bar-label"><span>${esc(r.name)}</span><strong>${r.display}</strong></div><div class="bar-track" aria-hidden="true"><div class="bar-fill" style="width:${max?100*r.amount/max:0}%"></div>${isSla?'<span class="target"></span>':''}</div><div class="bar-meta">${r.meta}</div></div>`).join('');
  }
  function renderSegments() {
    const a=group(selected,$('segment').value).sort((x,y)=>x.sla-y.sla||x.name.localeCompare(y.name));
    $('segments').innerHTML=a.length?bars(a.map(r=>({...r,amount:r.sla,display:fmt(r.sla,1)+'%',meta:`${r.cumple} cumplen / n = ${r.total}`})),100,true):'<p class="chart-empty">Sin datos para comparar segmentos.</p>';
  }
  function renderTrend() {
    const a=group(selected,'mes');
    if(!a.length){$('trend').innerHTML='<p class="chart-empty">Sin datos para mostrar la evolución.</p>';return;}
    const xs={'2026-04':70,'2026-05':275,'2026-06':480};
    const y=p=>180-1.35*p;
    const grid=[0,50,90,100].map(p=>`<line x1="45" x2="510" y1="${y(p)}" y2="${y(p)}" stroke="${p===90?'#8b2030':'#d9d1c9'}" ${p===90?'stroke-dasharray="5 4"':''}/><text x="35" y="${y(p)+4}" text-anchor="end">${p}</text>`).join('');
    const lines=a.slice(1).map((r,i)=> Number(r.name.slice(5))-Number(a[i].name.slice(5))===1?`<line x1="${xs[a[i].name]}" y1="${y(a[i].sla)}" x2="${xs[r.name]}" y2="${y(r.sla)}" stroke="#8b2030" stroke-width="3"/>`:'').join('');
    const dots=a.map(r=>`<circle cx="${xs[r.name]}" cy="${y(r.sla)}" r="5" fill="#8b2030"/><text x="${xs[r.name]}" y="${y(r.sla)-12}" text-anchor="middle">${fmt(r.sla,1)}%</text>`).join('');
    $('trend').innerHTML=`<svg class="trend-svg" viewBox="0 0 550 225" role="img" aria-label="SLA mensual. ${a.map(r=>months[r.name]+': '+fmt(r.sla,1)+'%').join('. ')}. Meta 90%.">${grid}${lines}${dots}${Object.entries(xs).map(([m,x])=>`<text x="${x}" y="205" text-anchor="middle">${months[m]}</text>`).join('')}</svg><table class="trend-table"><caption class="sr-only">Valores de la evolución mensual</caption><thead><tr><th scope="col">Mes</th><th scope="col">Cumplen / total</th><th scope="col">SLA</th></tr></thead><tbody>${a.map(r=>`<tr><td>${months[r.name]}</td><td>${r.cumple} / ${r.total}</td><td>${fmt(r.sla,1)}%</td></tr>`).join('')}</tbody></table>`;
  }
  function renderInterpretation(m) {
    if(!m.total){$('facts').innerHTML='<p>Sin embarques en la selección; no hay hechos que resumir.</p>';$('hypotheses').innerHTML='<p>Sin datos para formular hipótesis sobre esta selección.</p>';$('next').innerHTML='<p>Restablece los filtros o elige otra combinación antes de definir un piloto.</p>';return;}
    const lateUncoded=selected.filter(r=>r.retraso_min>0&&r.tipo_incidente==='Sin incidente').length;
    const worst=group(selected,'mes').sort((a,b)=>a.sla-b.sla)[0];
    const top=group(selected,'producto').sort((a,b)=>b.reclamaciones-a.reclamaciones)[0];
    $('facts').innerHTML=`<ol><li><strong>Servicio:</strong> ${m.cumple}/${m.total} cumplen (${fmt(m.sla,1)}%); ${m.brecha<0?fmt(-m.brecha,1)+' pp por debajo de':fmt(m.brecha,1)+' pp sobre'} la meta de 90%. ${months[worst.name]} registra ${fmt(worst.sla,1)}% (${worst.cumple}/${worst.total}).</li><li><strong>Registro:</strong> ${m.incidentes} incidentes; ${lateUncoded} de ${m.tardios} tardíos figuran “Sin incidente”. ${m.excursiones} excursiones &gt;8 °C. Esto no identifica causas.</li><li><strong>Monto:</strong> ${money(m.reclamaciones)} MXN. ${m.reclamaciones?`${esc(top.name)} concentra ${money(top.reclamaciones)} (${fmt(100*top.reclamaciones/m.reclamaciones,1)}%).`:'No hay reclamaciones monetarias en esta selección.'}</li></ol>`;
    $('hypotheses').innerHTML=`<ol><li><strong>Registro incompleto:</strong> ${lateUncoded?'los '+lateUncoded+' tardíos sin incidente clasificado podrían reflejar una cobertura insuficiente del registro.':'la ausencia de tardíos sin clasificar en este corte no descarta problemas de registro en otros segmentos.'} Validar con bitácoras y tiempos por etapa.</li><li><strong>Severidad o exposición:</strong> ${m.reclamaciones?`la concentración en ${esc(top.name)} podría relacionarse con el valor de la carga o con pocos casos de alto monto.`:'la ausencia de montos podría depender del momento de registro o del tipo de carga.'} Solicitar valor transportado, motivo y estado de cada reclamación.</li></ol><p class="sub">Explicaciones posibles; no son causas demostradas.</p>`;
    $('next').innerHTML=`<p><strong>Propuesta:</strong> usar ${months[worst.name]} como referencia del corte (${fmt(worst.sla,1)}% SLA; n=${worst.total}) y seleccionar embarques futuros comparables. No ejecutar un piloto sobre datos sintéticos.</p><p><strong>Días 1–5:</strong> responsable propuesto: jefatura de operaciones. Auditar tardíos, conciliar los $100 y acordar segmento, costo e intervención según causa validada.</p><p><strong>Días 6–25:</strong> probar la intervención en un grupo y mantener un grupo comparable de referencia; registrar puntualidad, etapas y motivos.</p><p><strong>Días 26–30:</strong> comparar SLA y su cambio frente al grupo de referencia. Meta propuesta: ≥90%, sin aumentar excursiones por 100 embarques ni reclamaciones por embarque. Informar tamaño de muestra e incertidumbre; ampliar si la evidencia es insuficiente.</p>`;
  }
  function renderTable() {
    const ordered=selected.slice().sort((a,b)=>a.fecha_salida.localeCompare(b.fecha_salida)||a.id_embarque.localeCompare(b.id_embarque));
    const visible=ordered.slice((page-1)*pageSize,page*pageSize);
    $('table-count').textContent=`${selected.length} embarques en la selección`;
    $('rows').innerHTML=visible.length?visible.map(r=>`<tr><td>${esc(r.id_embarque)}<span class="cell-sub">${date(r.fecha_salida)}</span></td><td>${esc(r.origen)} → ${esc(r.destino)}<span class="cell-sub">${esc(r.producto)}</span></td><td>${esc(r.transportista)}</td><td class="sla-status ${r.sla_entrega==='No cumple'?'bad':''}">${esc(r.sla_entrega)}</td><td>${fmt(r.retraso_min,1)}</td><td>${esc(r.tipo_incidente)}</td><td>${fmt(r.temperatura_max_c,1)}</td><td>${money(r.reclamacion_mxn)}</td><td><details><summary aria-label="Ver campos de ${esc(r.id_embarque)}">Ver</summary><p>Unidad: ${esc(r.unidad)}</p><p>Tipo de ruta: ${esc(r.tipo_ruta)}</p><p>Tránsito: ${fmt(r.horas_transito)} h</p><p>Distancia: ${fmt(r.distancia_km)} km</p><p>Ocupación: ${fmt(r.ocupacion_unidad*100,1)}%</p><p>Excursión &gt;8 °C: ${esc(r.excursion_temp_mayor_8c)}</p><p>Satisfacción: ${fmt(r.satisfaccion_1_10,1)}/10</p></details></td></tr>`).join(''):'<tr><td colspan="9">Sin resultados para la selección.</td></tr>';
    const count=Math.ceil(selected.length/pageSize);
    $('page-state').textContent=count?`Página ${page} de ${count}`:'0 páginas';
    $('prev').disabled=page<=1;
    $('next-page').disabled=page>=count;
  }
  function render() {
    selected=filter(data,filters);
    const m=metrics(selected);
    const active=Object.entries(filters).filter(([,v])=>v).map(([k,v])=>dimensions[k]+': '+(months[v]||v));
    const dates=selected.map(r=>r.fecha_salida).sort();
    $('scope').textContent=`${m.total} de ${data.length} embarques · ${active.join(' · ')||'Todos los filtros'}${m.total?' · Periodo seleccionado: '+date(dates[0])+'–'+date(dates[dates.length-1]):''}`;
    $('empty').hidden=m.total>0;
    $('kpis').innerHTML=[kpi('total','Embarques',fmt(m.total),'','Base de todos los indicadores'),kpi('sla','Cumplimiento SLA',fmt(m.sla,1),'%',`${m.cumple} de ${m.total} cumplen · meta 90%`,true),kpi('brecha','Brecha contra la meta',m.brecha===null?'—':(m.brecha>0?'+':'')+fmt(m.brecha,1),'pp','SLA − 90% · puntos porcentuales'),kpi('retraso','Retraso de tardíos',fmt(m.retraso,1),'min',`${m.tardios} embarques con retraso >0`),kpi('incidentes','Incidentes',fmt(m.incidentes),'','Excluye “Sin incidente”'),kpi('excursiones','Excursiones >8 °C',fmt(m.excursiones),'','Alerta operativa · indicador “Sí”'),kpi('reclamaciones','Reclamaciones',money(m.reclamaciones),'MXN','Suma fuente · control discrepa $100'),kpi('satisfaccion','Satisfacción',fmt(m.satisfaccion,1),'/10',`Promedio simple · n = ${m.total}`)].join('');
    renderTrend();renderSegments();
    const incidents=group(selected,'tipo_incidente').filter(r=>r.name!=='Sin incidente').sort((a,b)=>b.total-a.total||a.name.localeCompare(b.name));
    $('incidents').innerHTML=incidents.length?bars(incidents.map(r=>({...r,amount:r.total,display:fmt(r.total),meta:`${fmt(100*r.total/m.total,1)}% de ${m.total} embarques`})),Math.max(...incidents.map(r=>r.total))):`<p class="chart-empty">${m.total?'Sin incidentes registrados en la selección.':'Sin datos de incidentes.'}</p>`;
    $('incident-note').textContent=m.total?`${m.total-m.incidentes} embarques figuran “Sin incidente”. Una categoría no demuestra la causa del retraso.`:'Sin base para calcular frecuencias.';
    const claims=group(selected,'producto').sort((a,b)=>b.reclamaciones-a.reclamaciones||a.name.localeCompare(b.name));
    $('claims').innerHTML=claims.length?bars(claims.map(r=>({...r,amount:r.reclamaciones,display:money(r.reclamaciones),meta:`MXN · n = ${r.total} embarques`})),Math.max(...claims.map(r=>r.reclamaciones))):'<p class="chart-empty">Sin datos de reclamaciones.</p>';
    renderInterpretation(m);renderTable();
  }
  render();
})();
