"""Lectura de la fuente original y oráculo independiente. No modifica el Excel."""
import collections
import datetime as dt
import hashlib
import json
from pathlib import Path
import statistics
import sys
import xml.etree.ElementTree as ET
import zipfile
from decimal import Decimal
import openpyxl

BASE = Path(__file__).resolve().parents[1]
SOURCE = Path(sys.argv[1]) if len(sys.argv) > 1 else BASE.parent / 'Datos_sinteticos_LogiFresh_dashboard.xlsx'
w = openpyxl.load_workbook(SOURCE, data_only=True)
values = list(w['Datos'].values)
rows = [dict(zip(values[0], row)) for row in values[1:]]
for row in rows:
    row['fecha_salida'] = row['fecha_salida'].date().isoformat()

def metrics(a):
    n = len(a)
    late = [r['retraso_min'] for r in a if r['retraso_min'] > 0]
    good = sum(r['sla_entrega'] == 'Cumple' for r in a)
    return dict(total=n, cumple=good, tardios=len(late), sla=100*good/n if n else None,
                brecha=100*good/n-90 if n else None, retraso=statistics.mean(late) if late else None,
                incidentes=sum(r['tipo_incidente'] != 'Sin incidente' for r in a),
                excursiones=sum(r['excursion_temp_mayor_8c'] == 'Sí' for r in a),
                reclamaciones=sum(r['reclamacion_mxn'] for r in a),
                satisfaccion=statistics.mean(r['satisfaccion_1_10'] for r in a) if n else None)

def subset(filters):
    return [r for r in rows if all((r['fecha_salida'][:7] if k == 'mes' else r[k]) == v for k,v in filters.items())]

def group(a,k):
    return [{'name':v,**metrics([r for r in a if (r['fecha_salida'][:7] if k=='mes' else r[k])==v])}
            for v in sorted({r['fecha_salida'][:7] if k=='mes' else r[k] for r in a})]

ns={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(SOURCE) as z:
    xml=ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
    exact_sum=sum(Decimal(c.find('m:v',ns).text) for c in xml.findall('.//m:c',ns)
                  if c.attrib['r'].startswith('N') and c.attrib.get('t')=='n')
assert exact_sum == 882549 == metrics(rows)['reclamaciones']

quality = dict(source=SOURCE.name, sha256=hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    rows=len(rows), columns=len(values[0]), unique_ids=len({r['id_embarque'] for r in rows}),
    duplicate_rows=len(rows)-len({json.dumps(r,sort_keys=True) for r in rows}),
    missing={k:sum(r[k] is None for r in rows) for k in values[0]},
    period=[min(r['fecha_salida'] for r in rows),max(r['fecha_salida'] for r in rows)],
    numeric_ranges={k:[min(r[k] for r in rows),max(r[k] for r in rows)] for k in values[0] if isinstance(rows[0][k],(int,float))},
    sla_delay_mismatches=sum((r['sla_entrega']=='Cumple') != (r['retraso_min']==0) for r in rows),
    temperature_mismatches=sum((r['excursion_temp_mayor_8c']=='Sí') != (r['temperatura_max_c']>8) for r in rows),
    incidents=dict(collections.Counter(r['tipo_incidente'] for r in rows)),
    controls=metrics(rows), claimed_control=882649, xml_sum=int(exact_sum),
    dictionary_fields=[r[0] for r in list(w['Diccionario_y_control'].values)[3:10]],
    claims_cells=[{'cell':c.attrib['r'],'amount':int(Decimal(c.find('m:v',ns).text))} for c in xml.findall('.//m:c',ns) if c.attrib['r'].startswith('N') and c.attrib.get('t')=='n' and Decimal(c.find('m:v',ns).text)>0])
assert quality['unique_ids']==240 and not quality['duplicate_rows']
assert not any(quality['missing'].values())
assert not quality['sla_delay_mismatches'] and not quality['temperature_mismatches']
assert all(1 <= r['satisfaccion_1_10'] <= 10 and 0 <= r['ocupacion_unidad'] <= 1 for r in rows)

cases=[{}, {'mes':'2026-04'}, {'mes':'2026-04','producto':'Preparados'},
       {'origen':'CDMX','transportista':'Centro'}, {'sla_entrega':'No cumple'},
       {'tipo_incidente':'Temperatura'}, {'destino':'Mérida'}, {'tipo_ruta':'Estándar'}]
dimensions=['mes','origen','destino','producto','transportista','tipo_ruta','sla_entrega','tipo_incidente']
oracle=[]
for filters in cases:
    a=subset(filters)
    oracle.append(dict(filters=filters,ids=[r['id_embarque'] for r in a],metrics=metrics(a),
                       groups={k:group(a,k) for k in dimensions}))
BASE.joinpath('data.js').write_text('window.LOGIFRESH_DATA = '+json.dumps(rows,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
BASE.joinpath('tests/oracle.json').write_text(json.dumps(oracle,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
BASE.joinpath('tests/quality.json').write_text(json.dumps(quality,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'quality':quality,'cases':[{k:v for k,v in c.items() if k in ['filters','metrics']} for c in oracle]},ensure_ascii=False,indent=2))
