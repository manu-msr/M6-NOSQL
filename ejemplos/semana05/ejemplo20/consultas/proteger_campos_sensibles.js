var curso = db.getSiblingDB("m6_nosql");
var casos = curso.casos_protegidos;

if (casos.countDocuments({}) !== 4) {
  throw new Error("Carga primero los datos compartidos de la semana 5.");
}

print("=== Exclusión para una salida operativa ===");
var salidaExcluida = casos.find(
  { estado: "abierto" },
  { titular: 0, polizaId: 0, descripcion: 0 }
).sort({ ocurridoEn: 1 }).toArray();
printjson(salidaExcluida);

print("\n=== Salida enmascarada para confirmación visual ===");
var salidaEnmascarada = casos.aggregate([
  {
    $project: {
      _id: 1,
      producto: 1,
      estado: 1,
      correoEnmascarado: "[correo protegido]",
      telefonoEnmascarado: {
        $concat: [
          "******",
          { $substrCP: ["$titular.telefono", 6, 4] }
        ]
      }
    }
  },
  { $sort: { _id: 1 } }
]).toArray();
printjson(salidaEnmascarada);

curso.casos_analitica.drop();
curso.createView(
  "casos_analitica",
  "casos_protegidos",
  [
    {
      $project: {
        _id: 0,
        producto: 1,
        estado: 1,
        ocurridoEn: 1,
        montoReclamado: 1,
        entidad: "$ubicacion.entidad",
        zonaPostal: {
          $concat: [
            { $substrCP: ["$ubicacion.codigoPostal", 0, 2] },
            "***"
          ]
        }
      }
    }
  ]
);

print("\n=== Vista analítica minimizada ===");
var vista = curso.casos_analitica.find({}).sort({ ocurridoEn: 1 }).toArray();
printjson(vista);

var camposProhibidos = ["_id", "polizaId", "descripcion", "titular", "ubicacion"];
var vistaExponeCampos = vista.some(function (documento) {
  return camposProhibidos.some(function (campo) {
    return Object.prototype.hasOwnProperty.call(documento, campo);
  });
});

if (
  salidaExcluida.length !== 2 ||
  salidaEnmascarada[0].telefonoEnmascarado !== "******0001" ||
  vista.length !== 4 ||
  vistaExponeCampos
) {
  throw new Error("La protección de salida no produjo el resultado esperado.");
}
