var curso = db.getSiblingDB("m6_nosql");
var fuente = curso.mediciones_riesgo_reto_fuente;
var destino = curso.mediciones_riesgo_reto;

if (fuente.countDocuments({}) !== 8) {
  throw new Error("Carga primero los datos del Reto 07.");
}

destino.drop();

var documentos = fuente.find({}).toArray().map(function (registro) {
  return {
    _id: registro._id,
    medidoEn: null, // Convierte la marca de tiempo textual.
    meta: {
      sensorId: null, // Conserva los metadatos estables de la serie.
      variable: null,
      zona: null,
      unidad: null
    },
    granularidadCapturaMinutos: null,
    valor: null
  };
});

if (
  documentos.some(function (documento) {
    return documento.medidoEn === null ||
      documento.meta.sensorId === null ||
      documento.meta.variable === null ||
      documento.meta.zona === null ||
      documento.meta.unidad === null ||
      documento.granularidadCapturaMinutos === null ||
      documento.valor === null;
  })
) {
  throw new Error("Completa el modelado temporal antes de insertar.");
}

destino.insertMany(documentos);

destino.createIndex(
  {}, // Completa el índice por sensor, variable y tiempo.
  { name: "serie_medicion" }
);

var filtro = {
  "meta.sensorId": "SEN-RET-01",
  "meta.variable": "precipitacion",
  medidoEn: {
    $gte: new Date("2026-04-10T00:30:00Z"),
    $lt: new Date("2026-04-10T01:30:00Z")
  }
};

print("=== Lecturas modeladas en el intervalo ===");
var resultado = destino.find(
  filtro,
  { _id: 1, medidoEn: 1, valor: 1, "meta.unidad": 1 }
).sort({ medidoEn: 1 }).toArray();
printjson(resultado);

if (resultado.length !== 2) {
  throw new Error("El intervalo debe recuperar dos lecturas.");
}
