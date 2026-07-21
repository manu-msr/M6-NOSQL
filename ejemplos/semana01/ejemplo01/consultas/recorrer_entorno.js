var curso = db.getSiblingDB("m6_nosql");

print("\n=== 1. Base de datos activa ===");
print(curso.getName());

print("\n=== 2. Colecciones base disponibles ===");
var coleccionesDisponibles = curso.getCollectionNames();
var coleccionesBase = [
  "polizas",
  "polizas_referencias",
  "coberturas_poliza",
  "siniestros"
];
printjson(
  coleccionesBase.map(function (nombre) {
    return {
      coleccion: nombre,
      disponible: coleccionesDisponibles.indexOf(nombre) !== -1
    };
  })
);

print("\n=== 3. Cantidad de documentos ===");
print("Pólizas: " + curso.polizas.countDocuments({}));
print("Siniestros: " + curso.siniestros.countDocuments({}));

print("\n=== 4. Documento de ejemplo ===");
printjson(curso.polizas.findOne({ _id: "POL-1001" }));

print("\nCierre de la demostración:");
print("El entorno responde y la base m6_nosql está lista para realizar consultas.");
