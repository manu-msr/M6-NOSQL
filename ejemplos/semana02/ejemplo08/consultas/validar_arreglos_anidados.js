var curso = db.getSiblingDB("m6_nosql");
var nombreColeccion = "polizas_validadas_ejemplo";

curso[nombreColeccion].drop();

curso.createCollection(nombreColeccion, {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id", "producto", "coberturas"],
      properties: {
        _id: { bsonType: "string" },
        producto: { bsonType: "string" },
        coberturas: {
          bsonType: "array",
          minItems: 1,
          items: {
            bsonType: "object",
            required: ["clave", "limite"],
            properties: {
              clave: { bsonType: "string" },
              limite: {
                bsonType: ["int", "long", "double", "decimal"],
                minimum: 0
              }
            }
          }
        },
        beneficiario: {
          bsonType: "object",
          required: ["personaId", "parentesco"],
          properties: {
            personaId: { bsonType: "string" },
            parentesco: { bsonType: "string" }
          }
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});

var polizasValidadas = curso.getCollection(nombreColeccion);

function probarInsercion(etiqueta, documento) {
  try {
    polizasValidadas.insertOne(documento);
    print(etiqueta + ": aceptada");
  } catch (error) {
    print(etiqueta + ": rechazada (" + (error.codeName || "regla de validación") + ")");
  }
}

print("\n=== Pruebas de escritura ===");
probarInsercion("Sin beneficiario opcional", {
  _id: "VAL-POL-01",
  producto: "auto",
  coberturas: [
    { clave: "DM", limite: 450000 },
    { clave: "RC", limite: 3000000 }
  ]
});

probarInsercion("Con beneficiario completo", {
  _id: "VAL-POL-02",
  producto: "vida",
  coberturas: [
    { clave: "FAL", limite: 1200000 }
  ],
  beneficiario: {
    personaId: "PER-SINT-021",
    parentesco: "conyuge"
  }
});

probarInsercion("Arreglo vacío", {
  _id: "VAL-POL-03",
  producto: "hogar",
  coberturas: []
});

probarInsercion("Cobertura incompleta", {
  _id: "VAL-POL-04",
  producto: "auto",
  coberturas: [
    { clave: "DM" }
  ]
});

probarInsercion("Beneficiario incompleto", {
  _id: "VAL-POL-05",
  producto: "vida",
  coberturas: [
    { clave: "FAL", limite: 900000 }
  ],
  beneficiario: {
    personaId: "PER-SINT-022"
  }
});

print("\nDocumentos almacenados: " + polizasValidadas.countDocuments({}));
printjson(polizasValidadas.find({}).sort({ _id: 1 }).toArray());

print("\nCierre de la demostración:");
print("La ausencia opcional es válida; una estructura presente debe satisfacer su subesquema.");
