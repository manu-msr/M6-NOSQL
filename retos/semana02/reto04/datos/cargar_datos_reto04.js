// Preparación sintética exclusiva del Reto 04.

var curso = db.getSiblingDB("m6_nosql");
var nombreColeccion = "siniestros_validacion_reto";

curso[nombreColeccion].drop();
curso.createCollection(nombreColeccion);

var informacion = curso.getCollectionInfos({ name: nombreColeccion });

if (informacion.length !== 1 || informacion[0].options.validator) {
  throw new Error("La colección del Reto 04 debe existir inicialmente sin validador.");
}

print("Colección " + nombreColeccion + " preparada sin validador.");
print("Documentos iniciales: " + curso[nombreColeccion].countDocuments({}) + ".");
