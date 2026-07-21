var curso = db.getSiblingDB("m6_nosql");
var nombreColeccion = "siniestros_validacion_reto";

if (curso.getCollectionInfos({ name: nombreColeccion }).length !== 1) {
  throw new Error("Prepara primero la colección del Reto 04.");
}

var esquema = {
  // Completa aquí el tipo raíz, required y properties.
};

if (!esquema.bsonType || !esquema.required || !esquema.properties) {
  throw new Error("Completa el esquema antes de ejecutar las pruebas.");
}

var modificacion = curso.runCommand({
  collMod: nombreColeccion,
  validator: { $jsonSchema: esquema },
  validationLevel: "strict",
  validationAction: "error"
});

if (modificacion.ok !== 1) {
  throw new Error("No fue posible aplicar el validador.");
}

var siniestros = curso.getCollection(nombreColeccion);
siniestros.deleteMany({});

function probarInsercion(etiqueta, documento) {
  try {
    siniestros.insertOne(documento);
    print(etiqueta + ": aceptada");
  } catch (error) {
    print(etiqueta + ": rechazada (" + (error.codeName || "regla de validación") + ")");
  }
}

print("=== Pruebas del Reto 04 ===");

probarInsercion("1. Documento completo", {
  _id: "RET-VAL-01",
  polizaId: "POL-RET-101",
  fechaOcurrencia: ISODate("2026-06-05T00:00:00Z"),
  montoReclamado: 68000,
  estado: "en_revision",
  coberturasAfectadas: ["DM", "RC"],
  aviso: { canal: "app", diasDespues: 0 }
});

probarInsercion("2. Documento válido sin aviso", {
  _id: "RET-VAL-02",
  polizaId: "POL-RET-102",
  fechaOcurrencia: ISODate("2026-06-07T00:00:00Z"),
  montoReclamado: 24000,
  estado: "cerrado",
  coberturasAfectadas: ["DM"]
});

probarInsercion("3. Falta polizaId", {
  _id: "RET-VAL-03",
  fechaOcurrencia: ISODate("2026-06-09T00:00:00Z"),
  montoReclamado: 31000,
  estado: "en_revision",
  coberturasAfectadas: ["DAN"]
});

probarInsercion("4. Fecha como cadena", {
  _id: "RET-VAL-04",
  polizaId: "POL-RET-104",
  fechaOcurrencia: "2026-06-11",
  montoReclamado: 47000,
  estado: "en_revision",
  coberturasAfectadas: ["ROB"]
});

probarInsercion("5. Monto negativo", {
  _id: "RET-VAL-05",
  polizaId: "POL-RET-105",
  fechaOcurrencia: ISODate("2026-06-13T00:00:00Z"),
  montoReclamado: -1000,
  estado: "rechazado",
  coberturasAfectadas: ["INC"]
});

probarInsercion("6. Estado fuera del dominio", {
  _id: "RET-VAL-06",
  polizaId: "POL-RET-106",
  fechaOcurrencia: ISODate("2026-06-15T00:00:00Z"),
  montoReclamado: 19000,
  estado: "pendiente",
  coberturasAfectadas: ["DM"]
});

probarInsercion("7. Arreglo de coberturas vacío", {
  _id: "RET-VAL-07",
  polizaId: "POL-RET-107",
  fechaOcurrencia: ISODate("2026-06-17T00:00:00Z"),
  montoReclamado: 82000,
  estado: "en_revision",
  coberturasAfectadas: []
});

probarInsercion("8. Aviso presente pero incompleto", {
  _id: "RET-VAL-08",
  polizaId: "POL-RET-108",
  fechaOcurrencia: ISODate("2026-06-19T00:00:00Z"),
  montoReclamado: 56000,
  estado: "en_revision",
  coberturasAfectadas: ["DAN"],
  aviso: { canal: "portal" }
});

print("\nDocumentos almacenados: " + siniestros.countDocuments({}));
printjson(siniestros.find({}).sort({ _id: 1 }).toArray());
