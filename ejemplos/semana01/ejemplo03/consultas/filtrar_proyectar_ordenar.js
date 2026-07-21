var curso = db.getSiblingDB("m6_nosql");

var filtro2026Monto = {
  fechaOcurrencia: {
    $gte: ISODate("2026-01-01T00:00:00Z"),
    $lt: ISODate("2027-01-01T00:00:00Z")
  },
  montoReclamado: { $gte: 50000 }
};

print("\n=== Etapa 1. Salida después de $match ===");
printjson(
  curso.siniestros.aggregate([
    { $match: filtro2026Monto }
  ]).toArray()
);

print("\n=== Etapa 2. Salida después de $match y $project ===");
printjson(
  curso.siniestros.aggregate([
    { $match: filtro2026Monto },
    {
      $project: {
        _id: 0,
        siniestro: "$_id",
        polizaId: 1,
        fechaOcurrencia: 1,
        montoReclamado: 1,
        estado: 1
      }
    }
  ]).toArray()
);

print("\n=== Etapa 3. Pipeline completo con $sort ===");
printjson(
  curso.siniestros.aggregate([
    { $match: filtro2026Monto },
    {
      $project: {
        _id: 0,
        siniestro: "$_id",
        polizaId: 1,
        fechaOcurrencia: 1,
        montoReclamado: 1,
        estado: 1
      }
    },
    { $sort: { montoReclamado: -1, siniestro: 1 } }
  ]).toArray()
);

print("\nCierre de la demostración:");
print("$match selecciona, $project da forma a la salida y $sort establece el orden.");
