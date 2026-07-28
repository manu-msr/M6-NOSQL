var curso = db.getSiblingDB("m6_nosql");
var fuentes = curso.bienes_geo_fuente.find({}).sort({ _id: 1 }).toArray();

if (fuentes.length !== 6) {
  throw new Error("Carga primero los datos de la semana 3.");
}

curso.bienes_geo.drop();

var documentosGeoJSON = fuentes.map(function (bien) {
  return {
    _id: bien._id,
    producto: bien.producto,
    estado: bien.estado,
    sumaAsegurada: bien.sumaAsegurada,
    ubicacion: {
      type: "Point",
      coordinates: [bien.longitud, bien.latitud]
    }
  };
});

print("=== Fuente del primer bien ===");
printjson(fuentes[0]);

print("\n=== Primer punto GeoJSON ===");
curso.bienes_geo.insertOne(documentosGeoJSON[0]);
printjson(curso.bienes_geo.findOne({ _id: "BIEN-GEO-01" }));

print("\n=== Resto de los bienes ===");
curso.bienes_geo.insertMany(documentosGeoJSON.slice(1));
printjson(
  curso.bienes_geo.find(
    {},
    { _id: 1, producto: 1, ubicacion: 1 }
  ).sort({ _id: 1 }).toArray()
);

print("\n=== Índice geoespacial ===");
var nombreIndice = curso.bienes_geo.createIndex(
  { ubicacion: "2dsphere" },
  { name: "ubicacion_2dsphere" }
);
print("Índice creado: " + nombreIndice);
printjson(curso.bienes_geo.getIndexes());

var total = curso.bienes_geo.countDocuments({
  "ubicacion.type": "Point",
  "ubicacion.coordinates.1": { $exists: true }
});

if (total !== 6) {
  throw new Error("La demostración debe terminar con seis puntos GeoJSON.");
}

print("\nCierre de la demostración:");
print("Cada bien conserva atributos temáticos y un Point con orden longitud-latitud.");
