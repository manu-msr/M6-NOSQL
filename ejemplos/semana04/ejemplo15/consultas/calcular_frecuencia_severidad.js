var curso = db.getSiblingDB("m6_nosql");
var siniestros = curso.siniestros_temporales;
var exposicion = curso.exposicion_temporal;

if (siniestros.countDocuments({}) !== 10 || exposicion.countDocuments({}) !== 6) {
  throw new Error("Carga primero los datos compartidos de la semana 4.");
}

siniestros.createIndex(
  { "meta.producto": 1, "meta.region": 1, estado: 1, ocurrioEn: 1 },
  { name: "serie_estado_ocurrencia" }
);

var pipeline = [
  {
    $match: {
      "meta.producto": "auto",
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
      periodo: {
        $dateToString: { format: "%Y-%m", date: "$ocurrioEn", timezone: "UTC" }
      },
      claveSeriePeriodo: {
        $concat: [
          "$meta.producto",
          "|",
          "$meta.region",
          "|",
          { $dateToString: { format: "%Y-%m", date: "$ocurrioEn", timezone: "UTC" } }
        ]
      }
    }
  },
  {
    $group: {
      _id: { clave: "$claveSeriePeriodo", periodo: "$periodo" },
      siniestros: { $sum: 1 },
      montoTotal: { $sum: "$montoPagado" },
      severidadPromedio: { $avg: "$montoPagado" }
    }
  },
  {
    $lookup: {
      from: "exposicion_temporal",
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
      frecuencia: {
        $round: [{ $divide: ["$siniestros", "$exposicion.polizasExpuestas"] }, 6]
      },
      montoTotal: 1,
      severidadPromedio: { $round: ["$severidadPromedio", 2] },
      costoPorExpuesta: {
        $round: [{ $divide: ["$montoTotal", "$exposicion.polizasExpuestas"] }, 2]
      }
    }
  },
  { $sort: { periodo: 1 } }
];

print("=== Frecuencia y severidad por mes ===");
var resultado = siniestros.aggregate(pipeline).toArray();
printjson(resultado);

var esperado = [
  { periodo: "2026-01", siniestros: 3, polizasExpuestas: 1000, frecuencia: 0.003, montoTotal: 150000, severidadPromedio: 50000, costoPorExpuesta: 150 },
  { periodo: "2026-02", siniestros: 2, polizasExpuestas: 980, frecuencia: 0.002041, montoTotal: 75000, severidadPromedio: 37500, costoPorExpuesta: 76.53 },
  { periodo: "2026-03", siniestros: 3, polizasExpuestas: 1020, frecuencia: 0.002941, montoTotal: 180000, severidadPromedio: 60000, costoPorExpuesta: 176.47 }
];

var resultadoNormalizado = resultado.map(function (periodo) {
  return {
    periodo: periodo.periodo,
    siniestros: periodo.siniestros,
    polizasExpuestas: periodo.polizasExpuestas,
    frecuencia: periodo.frecuencia,
    montoTotal: periodo.montoTotal,
    severidadPromedio: periodo.severidadPromedio,
    costoPorExpuesta: periodo.costoPorExpuesta
  };
});

if (JSON.stringify(resultadoNormalizado) !== JSON.stringify(esperado)) {
  throw new Error("Los indicadores temporales no coinciden con el resultado esperado.");
}
