var curso = db.getSiblingDB("m6_nosql");
var movimientos = curso.movimientos_temporales;

if (movimientos.countDocuments({}) !== 8) {
  throw new Error("Carga primero los datos compartidos de la semana 4.");
}

movimientos.createIndex(
  { "meta.polizaId": 1, ocurrioEn: 1 },
  { name: "poliza_ocurrencia" }
);

var filtro = {
  "meta.polizaId": "POL-TEM-001",
  ocurrioEn: {
    $gte: new Date("2026-02-01T00:00:00Z"),
    $lt: new Date("2026-03-01T00:00:00Z")
  }
};

print("=== Un evento con dos tiempos ===");
printjson(movimientos.findOne({ _id: "MOV-TEM-004" }));

print("\n=== Historial de febrero de POL-TEM-001 ===");
var resultado = movimientos.find(
  filtro,
  {
    _id: 1,
    ocurrioEn: 1,
    registradoEn: 1,
    "meta.tipoEvento": 1,
    monto: 1,
    moneda: 1
  }
).sort({ ocurrioEn: 1 }).toArray();
printjson(resultado);

print("\n=== Plan de ejecución ===");
printjson(
  movimientos.find(filtro).sort({ ocurrioEn: 1 }).explain("executionStats")
    .queryPlanner.winningPlan
);

var idsEsperados = ["MOV-TEM-003", "MOV-TEM-004"];
if (
  JSON.stringify(resultado.map(function (documento) { return documento._id; })) !==
    JSON.stringify(idsEsperados)
) {
  throw new Error("El intervalo temporal no produjo el historial esperado.");
}
