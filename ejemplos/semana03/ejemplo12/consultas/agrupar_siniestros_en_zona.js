var curso = db.getSiblingDB("m6_nosql");
var siniestros = curso.siniestros_geo;
var zonas = curso.zonas_riesgo;

if (siniestros.countDocuments({}) !== 8 || zonas.countDocuments({}) !== 3) {
  throw new Error("Carga primero los datos de la semana 3.");
}

siniestros.dropIndexes();
zonas.dropIndexes();
siniestros.createIndex(
  { ubicacion: "2dsphere" },
  { name: "ubicacion_2dsphere" }
);
zonas.createIndex(
  { geometria: "2dsphere" },
  { name: "geometria_2dsphere" }
);

var zonaCentro = zonas.findOne({ _id: "ZONA-GEO-01" }).geometria;

print("=== Siniestros cerrados dentro de la zona ===");
var seleccionados = siniestros.find({
  estado: "cerrado",
  ubicacion: {
    $geoWithin: { $geometry: zonaCentro }
  }
}, {
  _id: 1,
  tipoEvento: 1,
  montoReclamado: 1
}).sort({ _id: 1 }).toArray();
printjson(seleccionados);

print("\n=== Zonas que se intersectan con el área evaluada ===");
var zonasIntersectadas = zonas.find({
  geometria: {
    $geoIntersects: { $geometry: zonaCentro }
  }
}, {
  _id: 1,
  categoria: 1
}).sort({ _id: 1 }).toArray();
printjson(zonasIntersectadas);

print("\n=== Resumen de los siniestros contenidos ===");
var resumen = siniestros.aggregate([
  {
    $match: {
      estado: "cerrado",
      ubicacion: {
        $geoWithin: { $geometry: zonaCentro }
      }
    }
  },
  {
    $group: {
      _id: "$tipoEvento",
      eventos: { $sum: 1 },
      montoTotal: { $sum: "$montoReclamado" },
      montoPromedio: { $avg: "$montoReclamado" }
    }
  },
  {
    $sort: {
      eventos: -1,
      montoTotal: -1,
      _id: 1
    }
  }
]).toArray();
printjson(resumen);

if (seleccionados.length !== 3 || resumen.length !== 2) {
  throw new Error("La selección de control debe producir tres eventos y dos grupos.");
}

print("\nCierre de la demostración:");
print("El resumen describe los eventos cerrados contenidos en la zona, no todo el portafolio.");
