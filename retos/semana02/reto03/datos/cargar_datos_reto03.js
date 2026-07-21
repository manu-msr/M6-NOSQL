// Datos sintéticos exclusivos del Reto 03.

var curso = db.getSiblingDB("m6_nosql");
var coleccion = curso.polizas_indexacion_reto;

coleccion.drop();

var productos = ["auto", "hogar", "vida", "salud"];
var coberturasPorProducto = {
  auto: ["DM", "RC", "RT"],
  hogar: ["INC", "ROB", "DAN"],
  vida: ["FAL", "INV"],
  salud: ["GMM", "AMB"]
};

function completarTresCifras(numero) {
  return ("000" + numero).slice(-3);
}

var polizas = [];

for (var numero = 1; numero <= 240; numero += 1) {
  var producto = productos[(numero - 1) % productos.length];
  var estado = "vigente";

  if (numero % 10 === 0) {
    estado = "cancelada";
  } else if (numero % 7 === 0) {
    estado = "vencida";
  }

  var anioInicio = 2024 + Math.floor((numero - 1) / 96);
  var mesInicio = (numero - 1) % 12;
  var diaInicio = ((numero * 7) % 28) + 1;
  var fechaInicio = new Date(Date.UTC(anioInicio, mesInicio, diaInicio));
  var fechaFin = new Date(fechaInicio.getTime() + 365 * 24 * 60 * 60 * 1000);

  polizas.push({
    _id: "IDX-POL-" + completarTresCifras(numero),
    producto: producto,
    estado: estado,
    sumaAsegurada: 250000 + numero * 7500,
    vigencia: {
      inicio: fechaInicio,
      fin: fechaFin
    },
    coberturas: coberturasPorProducto[producto].map(function (clave, posicion) {
      return {
        clave: clave,
        limite: 150000 + posicion * 250000 + numero * 1000
      };
    })
  });
}

coleccion.insertMany(polizas);

var total = coleccion.countDocuments({});
var indices = coleccion.getIndexes();

if (total !== 240 || indices.length !== 1 || indices[0].name !== "_id_") {
  throw new Error("La preparación del Reto 03 no coincide con 240 pólizas y sólo el índice _id_.");
}

print("Datos del Reto 03 cargados en m6_nosql.");
print(total + " pólizas; índice inicial: " + indices[0].name + ".");
