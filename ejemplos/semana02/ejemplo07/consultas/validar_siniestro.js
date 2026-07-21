var curso = db.getSiblingDB("m6_nosql");
var nombreColeccion = "siniestros_validados_ejemplo";

curso[nombreColeccion].drop();

curso.createCollection(nombreColeccion, {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "polizaId", "fechaOcurrencia", "montoReclamado"],
      properties: {
        _id: { bsonType: "string" },
        polizaId: { bsonType: "string" },
        fechaOcurrencia: { bsonType: "date" },
        montoReclamado: {
          bsonType: ["int", "long", "double", "decimal"],
          minimum: 0
        },
        estado: {
          bsonType: "string",
          enum: ["en_revision", "cerrado", "rechazado"]
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});

var siniestrosValidados = curso.getCollection(nombreColeccion);

function probarInsercion(etiqueta, documento) {
  try {
    siniestrosValidados.insertOne(documento);
    print(etiqueta + ": aceptada");
  } catch (error) {
    print(etiqueta + ": rechazada (" + (error.codeName || "regla de validación") + ")");
  }
}

print("\n=== Configuración activa ===");
printjson(curso.getCollectionInfos({ name: nombreColeccion })[0].options);

print("\n=== Pruebas de escritura ===");
probarInsercion("Documento completo", {
  _id: "VAL-SIN-01",
  polizaId: "POL-1001",
  fechaOcurrencia: ISODate("2026-07-01T00:00:00Z"),
  montoReclamado: 42000,
  estado: "en_revision"
});

probarInsercion("Falta polizaId", {
  _id: "VAL-SIN-02",
  fechaOcurrencia: ISODate("2026-07-02T00:00:00Z"),
  montoReclamado: 18000
});

probarInsercion("Fecha guardada como cadena", {
  _id: "VAL-SIN-03",
  polizaId: "POL-1002",
  fechaOcurrencia: "2026-07-03",
  montoReclamado: 25000
});

probarInsercion("Monto negativo", {
  _id: "VAL-SIN-04",
  polizaId: "POL-1003",
  fechaOcurrencia: ISODate("2026-07-04T00:00:00Z"),
  montoReclamado: -500
});

print("\nDocumentos almacenados: " + siniestrosValidados.countDocuments({}));
printjson(siniestrosValidados.find({}).toArray());

print("\nCierre de la demostración:");
print("La presencia, el tipo BSON y la restricción numérica se comprobaron por separado.");
