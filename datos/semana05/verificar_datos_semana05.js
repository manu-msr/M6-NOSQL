var curso = db.getSiblingDB("m6_nosql");

var avisos = curso.avisos_texto.find({}).toArray();
var casos = curso.casos_protegidos.find({}).toArray();
var evidencias = curso.evidencias_protegidas.find({}).toArray();

if (
  avisos.length !== 7 ||
  !avisos.every(function (aviso) {
    return typeof aviso.codigo === "string" &&
      typeof aviso.descripcion === "string" &&
      aviso.descripcion.length > 0;
  })
) {
  throw new Error("Los avisos de texto no tienen la estructura esperada.");
}

if (
  casos.length !== 4 ||
  !casos.every(function (caso) {
    return caso.ocurridoEn instanceof Date &&
      caso.titular &&
      /@example\.invalid$/.test(caso.titular.correo) &&
      /^[0-9]{10}$/.test(caso.titular.telefono) &&
      caso.ubicacion &&
      /^[0-9]{5}$/.test(caso.ubicacion.codigoPostal);
  })
) {
  throw new Error("Los casos protegidos no conservan los campos sintéticos esperados.");
}

if (
  evidencias.length !== 3 ||
  !evidencias.every(function (evidencia) {
    return evidencia.recibidoEn instanceof Date && evidencia.casoId;
  })
) {
  throw new Error("Las evidencias protegidas no tienen la estructura esperada.");
}

print("Verificación de la semana 5 correcta.");
print("7 avisos, 4 casos y 3 evidencias completamente sintéticos.");
