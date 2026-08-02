var curso = db.getSiblingDB("m6_nosql");
var fuente = curso.exposicion_temporal_fuente;
var destino = curso.exposicion_temporal;

if (fuente.countDocuments({}) !== 6) {
  throw new Error("Carga primero los datos compartidos de la semana 4.");
}

destino.drop();

destino.insertMany(fuente.find({}).toArray().map(function (registro) {
  var periodo = new Date(registro.periodoTexto);
  var periodoClave = registro.periodoTexto.slice(0, 7);
  return {
    _id: registro.producto + "|" + registro.region + "|" + periodoClave,
    periodo: periodo,
    meta: {
      producto: registro.producto,
      region: registro.region
    },
    granularidad: "mensual",
    polizasExpuestas: registro.polizasExpuestas,
    sumaAsegurada: registro.sumaAsegurada,
    claveSeriePeriodo: registro.producto + "|" + registro.region + "|" + periodoClave
  };
}));

destino.createIndex(
  { "meta.producto": 1, "meta.region": 1, periodo: 1 },
  { name: "serie_periodo" }
);

var filtro = {
  "meta.producto": "auto",
  "meta.region": "centro",
  periodo: {
    $gte: new Date("2026-01-01T00:00:00Z"),
    $lt: new Date("2026-04-01T00:00:00Z")
  }
};

print("=== Documento temporal modelado ===");
printjson(destino.findOne({ _id: "auto|centro|2026-01" }));

print("\n=== Índices ===");
printjson(destino.getIndexes());

print("\n=== Serie auto, región centro ===");
var resultado = destino.find(
  filtro,
  { _id: 1, periodo: 1, polizasExpuestas: 1, sumaAsegurada: 1 }
).sort({ periodo: 1 }).toArray();
printjson(resultado);

var idsEsperados = [
  "auto|centro|2026-01",
  "auto|centro|2026-02",
  "auto|centro|2026-03"
];

if (
  destino.countDocuments({}) !== 6 ||
  JSON.stringify(resultado.map(function (documento) { return documento._id; })) !==
    JSON.stringify(idsEsperados)
) {
  throw new Error("El modelado temporal no produjo la serie esperada.");
}
