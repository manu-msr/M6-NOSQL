var curso = db.getSiblingDB("m6_nosql");
var siniestros = curso.siniestros_temporales;

if (siniestros.countDocuments({}) !== 10) {
  throw new Error("Carga primero los datos compartidos de la semana 4.");
}

siniestros.createIndex(
  { "meta.producto": 1, "meta.region": 1, estado: 1, ocurrioEn: 1 },
  { name: "serie_estado_ocurrencia" }
);

var pipeline = [
  {
    $match: {
      "meta.producto": "auto",
      "meta.region": "centro",
      estado: "cerrado",
      ocurrioEn: {
        $gte: new Date("2026-01-01T00:00:00Z"),
        $lt: new Date("2026-04-01T00:00:00Z")
      }
    }
  },
  {
    $group: {
      _id: {
        $dateToString: { format: "%Y-%m", date: "$ocurrioEn", timezone: "UTC" }
      },
      siniestros: { $sum: 1 },
      montoTotal: { $sum: "$montoPagado" },
      montoPromedio: { $avg: "$montoPagado" },
      montoMinimo: { $min: "$montoPagado" },
      montoMaximo: { $max: "$montoPagado" }
    }
  },
  { $sort: { _id: 1 } }
];

print("=== Resumen mensual ordenado ===");
var resumen = siniestros.aggregate(pipeline).toArray();
printjson(resumen);

var variaciones = [];
for (var i = 1; i < resumen.length; i += 1) {
  var anterior = resumen[i - 1];
  var actual = resumen[i];
  var cambioAbsoluto = actual.montoTotal - anterior.montoTotal;
  variaciones.push({
    desde: anterior._id,
    hasta: actual._id,
    cambioAbsoluto: cambioAbsoluto,
    cambioRelativo: Math.round((cambioAbsoluto / anterior.montoTotal) * 10000) / 100
  });
}

var maximoMensual = resumen.reduce(function (maximo, periodo) {
  return periodo.montoTotal > maximo.montoTotal ? periodo : maximo;
}, resumen[0]);

print("\n=== Variaciones entre meses consecutivos ===");
printjson(variaciones);
print("\n=== Periodo con mayor monto total ===");
printjson(maximoMensual);
print("\nPatrón observado: el monto total baja y después sube; no es una tendencia monótona.");

var resumenEsperado = [
  { _id: "2026-01", siniestros: 3, montoTotal: 150000, montoPromedio: 50000, montoMinimo: 40000, montoMaximo: 60000 },
  { _id: "2026-02", siniestros: 2, montoTotal: 75000, montoPromedio: 37500, montoMinimo: 30000, montoMaximo: 45000 },
  { _id: "2026-03", siniestros: 3, montoTotal: 180000, montoPromedio: 60000, montoMinimo: 50000, montoMaximo: 70000 }
];
var variacionesEsperadas = [
  { desde: "2026-01", hasta: "2026-02", cambioAbsoluto: -75000, cambioRelativo: -50 },
  { desde: "2026-02", hasta: "2026-03", cambioAbsoluto: 105000, cambioRelativo: 140 }
];

if (
  JSON.stringify(resumen) !== JSON.stringify(resumenEsperado) ||
  JSON.stringify(variaciones) !== JSON.stringify(variacionesEsperadas) ||
  maximoMensual._id !== "2026-03"
) {
  throw new Error("El resumen o sus variaciones no coinciden con el control esperado.");
}
