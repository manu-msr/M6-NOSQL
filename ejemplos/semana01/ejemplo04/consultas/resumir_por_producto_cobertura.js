var curso = db.getSiblingDB("m6_nosql");

print("\n=== Forma inicial ===");
print("Siniestros: " + curso.siniestros.countDocuments({}));

print("\n=== Cambio de unidad después de $lookup y dos $unwind ===");
var apariciones = curso.siniestros.aggregate([
  {
    $lookup: {
      from: "polizas_referencias",
      localField: "polizaId",
      foreignField: "_id",
      as: "poliza"
    }
  },
  { $unwind: "$poliza" },
  { $unwind: "$coberturasAfectadas" },
  { $count: "documentosIntermedios" }
]).toArray();
printjson(apariciones);

print("\n=== Pipeline completo: resumen por producto y cobertura ===");
printjson(
  curso.siniestros.aggregate([
    {
      $lookup: {
        from: "polizas_referencias",
        localField: "polizaId",
        foreignField: "_id",
        as: "poliza"
      }
    },
    { $unwind: "$poliza" },
    { $unwind: "$coberturasAfectadas" },
    {
      $group: {
        _id: {
          producto: "$poliza.producto",
          cobertura: "$coberturasAfectadas"
        },
        apariciones: { $sum: 1 },
        montoReclamadoAsociado: { $sum: "$montoReclamado" },
        montoPromedioPorAparicion: { $avg: "$montoReclamado" }
      }
    },
    {
      $addFields: {
        producto: "$_id.producto",
        cobertura: "$_id.cobertura"
      }
    },
    {
      $project: {
        _id: 0,
        producto: 1,
        cobertura: 1,
        apariciones: 1,
        montoReclamadoAsociado: 1,
        montoPromedioPorAparicion: 1
      }
    },
    {
      $sort: {
        apariciones: -1,
        montoReclamadoAsociado: -1,
        producto: 1,
        cobertura: 1
      }
    }
  ]).toArray()
);

print("\nCierre de la demostración:");
print("La salida resume apariciones de cobertura; no distribuye el monto de un siniestro entre sus coberturas.");
