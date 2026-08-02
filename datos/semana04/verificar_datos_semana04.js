var curso = db.getSiblingDB("m6_nosql");

function todosSonFechas(documentos, campo) {
  return documentos.every(function (documento) {
    return documento[campo] instanceof Date && !isNaN(documento[campo].getTime());
  });
}

var exposiciones = curso.exposicion_temporal.find({}).toArray();
var movimientos = curso.movimientos_temporales.find({}).toArray();
var siniestros = curso.siniestros_temporales.find({}).toArray();

if (
  exposiciones.length !== 6 ||
  !todosSonFechas(exposiciones, "periodo") ||
  !exposiciones.every(function (documento) {
    return documento.meta &&
      documento.meta.producto &&
      documento.meta.region &&
      documento.granularidad === "mensual" &&
      documento.polizasExpuestas > 0;
  })
) {
  throw new Error("La exposición temporal no conserva fecha, metadatos y granularidad.");
}

if (
  movimientos.length !== 8 ||
  !todosSonFechas(movimientos, "ocurrioEn") ||
  !todosSonFechas(movimientos, "registradoEn")
) {
  throw new Error("Los movimientos temporales no conservan ambas marcas de tiempo.");
}

if (
  siniestros.length !== 10 ||
  !todosSonFechas(siniestros, "ocurrioEn") ||
  !siniestros.every(function (documento) {
    return documento.meta && documento.montoPagado >= 0;
  })
) {
  throw new Error("Los siniestros temporales no tienen la estructura esperada.");
}

print("Verificación de la semana 4 correcta.");
print("6 exposiciones, 8 movimientos y 10 siniestros con marcas de tiempo BSON Date.");
