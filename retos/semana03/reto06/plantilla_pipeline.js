var curso = db.getSiblingDB("m6_nosql");
var siniestros = curso.siniestros_zona_reto;
var zonas = curso.zonas_analisis_reto;

if (siniestros.countDocuments({}) !== 10 || zonas.countDocuments({}) !== 1) {
  throw new Error("Carga primero los datos del Reto 06.");
}

var zona = zonas.findOne({ _id: "ZONA-RET-01" }).geometria;

var pipeline = [
  {
    $match: {
      estado: "cerrado",
      ubicacion: {
        // Completa aquí la relación de pertenencia y la geometría de consulta.
      }
    }
  },
  {
    $group: {
      _id: null,          // Sustituye por el campo de agrupación.
      eventos: null,      // Completa el conteo.
      montoTotal: null,   // Completa la suma.
      montoPromedio: null // Completa el promedio.
    }
  },
  {
    $sort: {
      eventos: -1,
      montoTotal: -1,
      _id: 1
    }
  }
];

var filtro = pipeline[0].$match;
var grupo = pipeline[1].$group;

if (
  !filtro.ubicacion.$geoWithin ||
  !filtro.ubicacion.$geoWithin.$geometry
) {
  throw new Error("Completa la condición de pertenencia antes de ejecutar el pipeline.");
}

if (
  grupo._id === null ||
  grupo.eventos === null ||
  grupo.montoTotal === null ||
  grupo.montoPromedio === null
) {
  throw new Error("Completa la etapa de agrupación antes de ejecutar el pipeline.");
}

print("=== Siniestros seleccionados ===");
printjson(
  siniestros.find(
    filtro,
    { _id: 1, tipoEvento: 1, montoReclamado: 1 }
  ).sort({ _id: 1 }).toArray()
);

print("\n=== Resumen territorial ===");
var resultado = siniestros.aggregate(pipeline).toArray();
printjson(resultado);

if (resultado.length !== 3) {
  throw new Error("El resumen del reto debe producir tres categorías.");
}
