var curso = db.getSiblingDB("m6_nosql");
var siniestros = curso.siniestros_temporales_reto08;
var exposicion = curso.exposicion_temporal_reto08;

if (siniestros.countDocuments({}) !== 9 || exposicion.countDocuments({}) !== 3) {
  throw new Error("Carga primero los datos del Reto 08.");
}

var pipeline = [
  {
    $match: {
      "meta.producto": "hogar",
      "meta.region": "centro",
      estado: "cerrado",
      ocurrioEn: {
        $gte: new Date("2026-01-01T00:00:00Z"),
        $lt: new Date("2026-04-01T00:00:00Z")
      }
    }
  },
  {
    $addFields: {
      periodo: null,          // Deriva el mes UTC con $dateToString.
      claveSeriePeriodo: null // Concatena producto, región y mes.
    }
  },
  {
    $group: {
      _id: { clave: "$claveSeriePeriodo", periodo: "$periodo" },
      siniestros: null,
      montoTotal: null,
      severidadPromedio: null,
      montoMinimo: null,
      montoMaximo: null
    }
  },
  {
    $lookup: {
      from: "exposicion_temporal_reto08",
      localField: "_id.clave",
      foreignField: "claveSeriePeriodo",
      as: "exposicion"
    }
  },
  { $unwind: "$exposicion" },
  {
    $project: {
      _id: 0,
      periodo: "$_id.periodo",
      siniestros: 1,
      polizasExpuestas: "$exposicion.polizasExpuestas",
      frecuencia: null,
      montoTotal: 1,
      severidadPromedio: null,
      montoMinimo: 1,
      montoMaximo: 1,
      costoPorExpuesta: null
    }
  },
  { $sort: { periodo: 1 } }
];

if (
  pipeline[1].$addFields.periodo === null ||
  pipeline[1].$addFields.claveSeriePeriodo === null ||
  pipeline[2].$group.siniestros === null ||
  pipeline[2].$group.montoTotal === null ||
  pipeline[2].$group.severidadPromedio === null ||
  pipeline[2].$group.montoMinimo === null ||
  pipeline[2].$group.montoMaximo === null ||
  pipeline[5].$project.frecuencia === null ||
  pipeline[5].$project.severidadPromedio === null ||
  pipeline[5].$project.costoPorExpuesta === null
) {
  throw new Error("Completa las etapas temporales y los indicadores antes de ejecutar.");
}

print("=== Indicadores temporales del Reto 08 ===");
var resultado = siniestros.aggregate(pipeline).toArray();
printjson(resultado);

if (resultado.length !== 3) {
  throw new Error("El pipeline debe producir tres periodos.");
}
