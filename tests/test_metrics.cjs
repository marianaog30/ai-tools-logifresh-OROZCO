/* node tests/test_metrics.cjs — sin dependencias. Oráculo generado desde Excel con Python. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const base = path.resolve(__dirname, '..');
const engine = require('../metrics.js');
const ctx = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(base,'data.js'),'utf8'),ctx);
const data = JSON.parse(JSON.stringify(ctx.window.LOGIFRESH_DATA));
const oracle = JSON.parse(fs.readFileSync(path.join(__dirname,'oracle.json'),'utf8'));
let comparisons = 0;
function compare(actual, expected, location) {
  if(typeof expected === 'number') assert.ok(Math.abs(actual-expected)<1e-9,`${location}: ${actual} != ${expected}`);
  else assert.deepEqual(actual, expected, location);
  comparisons++;
}
for(const sample of oracle){
  const a=engine.filter(data,sample.filters), m=engine.metrics(a);
  compare(a.map(r=>r.id_embarque), sample.ids, 'IDs '+JSON.stringify(sample.filters));
  for(const [key,expected] of Object.entries(sample.metrics)) compare(m[key],expected,key);
  for(const [key,groups] of Object.entries(sample.groups)){
    const actual=engine.group(a,key);
    compare(actual.map(g=>g.name),groups.map(g=>g.name),'grupos '+key);
    groups.forEach((g,i)=>Object.entries(g).forEach(([k,v])=>compare(actual[i][k],v,key+'/'+g.name+'/'+k)));
    compare(actual.reduce((s,g)=>s+g.total,0),a.length,'conservación de filas');
    compare(actual.reduce((s,g)=>s+g.reclamaciones,0),m.reclamaciones,'conservación de MXN');
  }
}
// Comprueba cada opción individual, y el cruce completo mes × producto × transportista.
let combinations=0;
const keys=Object.keys(oracle[0].groups);
for(const key of keys){
  for(const val of new Set(data.map(r=>key==='mes'?r.fecha_salida.slice(0,7):r[key]))){
    const expected=data.filter(r=>(key==='mes'?r.fecha_salida.slice(0,7):r[key])===val);
    compare(engine.filter(data,{[key]:val}),expected,'opción '+key+'/'+val);combinations++;
  }
}
for(const month of ['2026-04','2026-05','2026-06']) for(const product of new Set(data.map(r=>r.producto))) for(const carrier of new Set(data.map(r=>r.transportista))){
  const f={mes:month,producto:product,transportista:carrier};
  const a=data.filter(r=>r.fecha_salida.startsWith(month)&&r.producto===product&&r.transportista===carrier);
  compare(engine.filter(data,f),a,'intersección triple');combinations++;
}
const empty=engine.metrics([]);
for(const key of ['sla','brecha','retraso','satisfaccion']) compare(empty[key],null,'vacío '+key);
for(const key of ['total','incidentes','excursiones','reclamaciones']) compare(empty[key],0,'vacío '+key);
compare(engine.filter(data,{}).length,240,'restablecimiento');
const result={status:'PASS',comparisons,oracle_cases:oracle.length,filter_combinations:combinations,
  claims_control:{guide:882649,source:882549,difference:-100,status:'DISCREPANCIA ACEPTADA POR LA USUARIA'},
  browser_tests:'Ver REPORTE_VALIDACION.md; estas pruebas no sustituyen un navegador.'};
fs.writeFileSync(path.join(__dirname,'results.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
