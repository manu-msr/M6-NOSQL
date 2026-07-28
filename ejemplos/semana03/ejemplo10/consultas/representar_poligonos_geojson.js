var curso = db.getSiblingDB("m6_nosql");
var fuentes = curso.zonas_riesgo_fuente.find({}).sort({ _id: 1 }).toArray();

if (fuentes.length !== 3) {
  throw new Error("Carga primero los datos de la semana 3.");
}

curso.zonas_riesgo.drop();

var documentosGeoJSON = fuentes.map(function (zona) {
  return {
    _id: zona._id,
    categoria: zona.categoria,
    vigencia: zona.vigencia,
    geometria: {
      type: "Polygon",
      coordinates: [zona.vertices]
    }
  };
});

print("=== Fuente de la primera zona ===");
printjson(fuentes[0]);

print("\n=== Primer polígono GeoJSON ===");
curso.zonas_riesgo.insertOne(documentosGeoJSON[0]);
var primeraZona = curso.zonas_riesgo.findOne({ _id: "ZONA-GEO-01" });
printjson(primeraZona);

var anillo = primeraZona.geometria.coordinates[0];
var primeraPosicion = anillo[0];
var ultimaPosicion = anillo[anillo.length - 1];
printjson({
  posiciones: anillo.length,
  primeraPosicion: primeraPosicion,
  ultimaPosicion: ultimaPosicion,
  anilloCerrado:
    primeraPosicion[0] === ultimaPosicion[0] &&
    primeraPosicion[1] === ultimaPosicion[1]
});

print("\n=== Resto de las zonas ===");
curso.zonas_riesgo.insertMany(documentosGeoJSON.slice(1));
printjson(
  curso.zonas_riesgo.find(
    {},
    { _id: 1, categoria: 1, "geometria.type": 1 }
  ).sort({ _id: 1 }).toArray()
);

print("\n=== Índice geoespacial ===");
var nombreIndice = curso.zonas_riesgo.createIndex(
  { geometria: "2dsphere" },
  { name: "geometria_2dsphere" }
);
print("Índice creado: " + nombreIndice);
printjson(curso.zonas_riesgo.getIndexes());

if (curso.zonas_riesgo.countDocuments({ "geometria.type": "Polygon" }) !== 3) {
  throw new Error("La demostración debe terminar con tres polígonos GeoJSON.");
}

print("\nCierre de la demostración:");
print("Un Polygon conserva un arreglo de anillos y cada anillo contiene posiciones.");
