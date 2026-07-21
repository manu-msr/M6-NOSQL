var curso = db.getSiblingDB("m6_nosql");
var polizas = curso.polizas_indexacion_reto;

if (polizas.countDocuments({}) !== 240) {
  throw new Error("Carga primero los datos del Reto 03.");
}

polizas.dropIndexes();

var indicesPropuestos = [
  {
    key: {
      // Completa el patrón del índice que atenderá las consultas A y B.
    },
    name: "estrategia_producto_estado_inicio"
  },
  {
    key: {
      // Completa el patrón del índice que atenderá la consulta C.
    },
    name: "estrategia_coberturas"
  }
];

indicesPropuestos.forEach(function (indice) {
  if (Object.keys(indice.key).length === 0) {
    throw new Error("Completa los dos patrones de índices antes de ejecutar la estrategia.");
  }
  polizas.createIndex(indice.key, { name: indice.name });
});

function reunirEtapas(nodo, etapas, indicesMultikey) {
  if (nodo === null || typeof nodo !== "object") {
    return;
  }
  if (nodo.stage) {
    etapas.push(nodo.indexName ? nodo.stage + "(" + nodo.indexName + ")" : nodo.stage);
  }
  if (nodo.indexName && nodo.isMultiKey === true) {
    indicesMultikey.push(nodo.indexName);
  }
  Object.keys(nodo).forEach(function (clave) {
    reunirEtapas(nodo[clave], etapas, indicesMultikey);
  });
}

function resumir(etiqueta, explicacion) {
  var etapas = [];
  var indicesMultikey = [];
  reunirEtapas(explicacion.queryPlanner.winningPlan, etapas, indicesMultikey);
  print("\n" + etiqueta);
  printjson({
    etapas: etapas.filter(function (etapa, posicion) {
      return etapas.indexOf(etapa) === posicion;
    }),
    indicesMultikey: indicesMultikey.filter(function (indice, posicion) {
      return indicesMultikey.indexOf(indice) === posicion;
    }),
    nReturned: explicacion.executionStats.nReturned,
    totalKeysExamined: explicacion.executionStats.totalKeysExamined,
    totalDocsExamined: explicacion.executionStats.totalDocsExamined
  });
}

print("=== Índices propuestos ===");
printjson(polizas.getIndexes());

resumir(
  "Consulta A: auto vigente por inicio descendente",
  polizas.find({ producto: "auto", estado: "vigente" })
    .sort({ "vigencia.inicio": -1 })
    .explain("executionStats")
);

resumir(
  "Consulta B: producto auto",
  polizas.find({ producto: "auto" })
    .explain("executionStats")
);

resumir(
  "Consulta C: cobertura RC",
  polizas.find({ "coberturas.clave": "RC" })
    .explain("executionStats")
);
