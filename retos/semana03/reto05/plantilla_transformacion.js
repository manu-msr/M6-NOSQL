var curso = db.getSiblingDB("m6_nosql");
var fuente = curso.bienes_coordenadas_reto;
var destino = curso.bienes_georreferenciados_reto;

if (fuente.countDocuments({}) !== 7) {
  throw new Error("Carga primero los datos del Reto 05.");
}

function coordenadasValidas(bien) {
  return typeof bien.longitud === "number" &&
    typeof bien.latitud === "number" &&
    bien.longitud >= -180 &&
    bien.longitud <= 180 &&
    bien.latitud >= -90 &&
    bien.latitud <= 90;
}

var fuentes = fuente.find({}).sort({ _id: 1 }).toArray();
var rechazados = fuentes.filter(function (bien) {
  return !coordenadasValidas(bien);
});
var validos = fuentes.filter(coordenadasValidas);

var documentosGeoJSON = validos.map(function (bien) {
  return {
    _id: bien._id.replace("-F-", "-D-"),
    fuenteId: bien._id,
    producto: bien.producto,
    estado: bien.estado,
    sumaAsegurada: bien.sumaAsegurada,
    ubicacion: {
      type: "Point",
      coordinates: [
        // Completa el primer y el segundo componente con los campos correctos.
      ]
    }
  };
});

var patronIndice = {
  // Completa el campo geoespacial y el tipo de índice.
};

if (documentosGeoJSON.some(function (documento) {
  return documento.ubicacion.coordinates.length !== 2;
})) {
  throw new Error("Completa el orden de las coordenadas antes de transformar.");
}

if (Object.keys(patronIndice).length !== 1) {
  throw new Error("Completa el patrón del índice geoespacial.");
}

destino.drop();
destino.insertMany(documentosGeoJSON);
destino.createIndex(
  patronIndice,
  { name: "ubicacion_2dsphere" }
);

print("=== Fuentes rechazadas ===");
printjson(rechazados.map(function (bien) {
  return {
    _id: bien._id,
    longitud: bien.longitud,
    latitud: bien.latitud
  };
}));

print("\n=== Documentos GeoJSON ===");
printjson(
  destino.find(
    {},
    { _id: 1, fuenteId: 1, ubicacion: 1 }
  ).sort({ _id: 1 }).toArray()
);

print("\n=== Índices ===");
printjson(destino.getIndexes());

if (destino.countDocuments({}) !== 6) {
  throw new Error("El resultado debe contener seis bienes con coordenadas válidas.");
}
