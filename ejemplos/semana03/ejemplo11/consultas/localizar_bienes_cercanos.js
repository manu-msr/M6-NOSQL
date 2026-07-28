var curso = db.getSiblingDB("m6_nosql");
var bienes = curso.bienes_geo;

if (bienes.countDocuments({}) !== 6) {
  throw new Error("Carga primero los datos de la semana 3.");
}

bienes.dropIndexes();
bienes.createIndex(
  { ubicacion: "2dsphere" },
  { name: "ubicacion_2dsphere" }
);

var puntoRiesgo = {
  type: "Point",
  coordinates: [-99.1332, 19.4326]
};

print("=== Bienes vigentes a no más de 5 km ===");
var cercanos = bienes.find({
  estado: "vigente",
  ubicacion: {
    $near: {
      $geometry: puntoRiesgo,
      $maxDistance: 5000
    }
  }
}, {
  _id: 1,
  producto: 1,
  estado: 1,
  ubicacion: 1
}).toArray();
printjson(cercanos);

print("\n=== La misma cercanía dentro de un pipeline ===");
var conDistancia = bienes.aggregate([
  {
    $geoNear: {
      near: puntoRiesgo,
      key: "ubicacion",
      distanceField: "distanciaMetros",
      maxDistance: 5000,
      spherical: true,
      query: { estado: "vigente" }
    }
  },
  {
    $project: {
      _id: 1,
      producto: 1,
      distanciaMetros: { $round: ["$distanciaMetros", 0] }
    }
  }
]).toArray();
printjson(conDistancia);

if (cercanos.length !== conDistancia.length) {
  throw new Error("$near y $geoNear deben seleccionar la misma cantidad de bienes.");
}

print("\nCierre de la demostración:");
print("$near ordena por cercanía; $geoNear además conserva la distancia en el pipeline.");
