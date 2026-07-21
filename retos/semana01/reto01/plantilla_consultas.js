var curso = db.getSiblingDB("m6_nosql");

print("\n=== Dos siniestros en revisión con mayor monto ===");
printjson(
  curso.siniestros
    .find(
      {
        // TODO: agrega la condición sobre estado.
      },
      {
        // TODO: muestra _id, polizaId y montoReclamado.
      }
    )
    // TODO: ordena por monto descendente y usa _id como desempate.
    // TODO: limita la salida a dos documentos.
    .toArray()
);
