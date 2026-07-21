var curso = db.getSiblingDB("m6_nosql");

print("\n=== Consulta 1. Estructura de SIN-0003 ===");
printjson(curso.siniestros.findOne({ _id: "SIN-0003" }));

print("\n=== Consulta 2. Avisos recibidos por portal ===");
printjson(
  curso.siniestros
    .find(
      { "aviso.canal": "portal" },
      { _id: 1, polizaId: 1, "aviso.canal": 1, "aviso.diasDespues": 1 }
    )
    .sort({ _id: 1 })
    .toArray()
);

print("\n=== Consulta 3. Siniestros con etiqueta danio_agua ===");
printjson(
  curso.siniestros
    .find(
      { etiquetas: "danio_agua" },
      { _id: 1, polizaId: 1, etiquetas: 1 }
    )
    .sort({ _id: 1 })
    .toArray()
);

print("\n=== Consulta 4. En revisión, monto > 50000 y aviso por portal ===");
printjson(
  curso.siniestros
    .find(
      {
        estado: "en_revision",
        montoReclamado: { $gt: 50000 },
        "aviso.canal": "portal"
      },
      {
        _id: 1,
        polizaId: 1,
        fechaOcurrencia: 1,
        montoReclamado: 1
      }
    )
    .sort({ montoReclamado: -1 })
    .toArray()
);

print("\n=== Consulta 5. Tres montos mayores entre los siniestros en revisión ===");
printjson(
  curso.siniestros
    .find(
      { estado: "en_revision" },
      { _id: 1, polizaId: 1, montoReclamado: 1 }
    )
    .sort({ montoReclamado: -1, _id: 1 })
    .limit(3)
    .toArray()
);

print("\nCierre de la demostración:");
print("El filtro decide qué documentos continúan; la proyección decide qué campos muestra la respuesta.");
