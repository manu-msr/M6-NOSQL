var curso = db.getSiblingDB("m6_nosql");

var pipeline = [
  // 1. $match: estado y primer semestre de 2026.

  // 2. $lookup: relaciona la póliza mediante polizaId.

  // 3. Dos etapas $unwind: póliza y coberturas afectadas.

  // 4. $group: producto y cobertura; calcula frecuencia, suma y promedio.

  // 5. Prepara los campos finales sin _id.

  // 6. $sort: frecuencia, monto total y desempates.
];

print("\n=== Resultado del Reto 02 ===");
printjson(
  curso.siniestros_agregacion_reto.aggregate(pipeline).toArray()
);
