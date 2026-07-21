var curso = db.getSiblingDB("m6_nosql");
var polizas = curso.polizas_indexacion_reto;

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

if (polizas.countDocuments({}) !== 240) {
  throw new Error("Carga primero los datos del Reto 03.");
}

polizas.dropIndexes();

print("=== Planes iniciales: sólo existe el índice _id_ ===");

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
