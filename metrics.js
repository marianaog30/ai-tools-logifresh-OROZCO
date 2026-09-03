(function (root) {
  'use strict';
  const value = (row, key) => key === 'mes' ? row.fecha_salida.slice(0, 7) : row[key];
  function filter(rows, filters) {
    return rows.filter(row => Object.entries(filters).every(([key, selected]) => !selected || value(row, key) === selected));
  }
  function metrics(rows) {
    const total = rows.length;
    const cumple = rows.filter(r => r.sla_entrega === 'Cumple').length;
    const late = rows.filter(r => r.retraso_min > 0);
    const sum = key => rows.reduce((n, r) => n + r[key], 0);
    const sla = total ? cumple / total * 100 : null;
    return { total, cumple, tardios: late.length, sla, brecha: sla === null ? null : sla - 90,
      retraso: late.length ? late.reduce((n, r) => n + r.retraso_min, 0) / late.length : null,
      incidentes: rows.filter(r => r.tipo_incidente !== 'Sin incidente').length,
      excursiones: rows.filter(r => r.excursion_temp_mayor_8c === 'Sí').length,
      reclamaciones: sum('reclamacion_mxn'), satisfaccion: total ? sum('satisfaccion_1_10') / total : null };
  }
  function group(rows, key) {
    return [...new Set(rows.map(r => value(r, key)))].sort().map(name => ({name, ...metrics(rows.filter(r => value(r, key) === name))}));
  }
  const api = { filter, metrics, group, value };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LogiFresh = api;
})(typeof window !== 'undefined' ? window : this);
