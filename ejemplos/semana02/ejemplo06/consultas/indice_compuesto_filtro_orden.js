var curso = db.getSiblingDB("m6_nosql");

function reunirEtapas(nodo, etapas) {
  if (nodo === null || typeof nodo !== "object") {
    return;
  }
  if (nodo.stage) {
    etapas.push(nodo.indexName ? nodo.stage + "(" + nodo.indexName + ")" : nodo.stage);
  }
  Object.keys(nodo).forEach(function (clave) {
    reunirEtapas(nodo[clave], etapas);
  });
}

function resumirExplicacion(explicacion) {
  var etapas = [];
  reunirEtapas(explicacion.queryPlanner.winningPlan, etapas);
  var etapasUnicas = etapas.filter(function (etapa, posicion) {
    return etapas.indexOf(etapa) === posicion;
  });
  return {
    etapas: etapasUnicas,
    requiereSort: etapasUnicas.some(function (etapa) { return etapa === "SORT"; }),
    nReturned: explicacion.executionStats.nReturned,
    totalKeysExamined: explicacion.executionStats.totalKeysExamined,
    totalDocsExamined: explicacion.executionStats.totalDocsExamined
  };
}

curso.polizas.dropIndexes();

var nombreIndice = curso.polizas.createIndex(
  { producto: 1, estado: 1, "vigencia.inicio": -1 },
  { name: "producto_1_estado_1_inicio_-1" }
);

var filtroPrincipal = { producto: "auto", estado: "vigente" };
var ordenPrincipal = { "vigencia.inicio": -1 };

print("\n=== Índice compuesto ===");
print("Índice creado: " + nombreIndice);
printjson(curso.polizas.getIndexes());

print("\n=== Plan para filtro y ordenamiento ===");
var planPrincipal = curso.polizas.find(filtroPrincipal)
  .sort(ordenPrincipal)
  .explain("executionStats");
printjson(resumirExplicacion(planPrincipal));

print("\n=== Resultado ordenado ===");
printjson(
  curso.polizas.find(
    filtroPrincipal,
    { _id: 1, producto: 1, estado: 1, "vigencia.inicio": 1 }
  ).sort(ordenPrincipal).toArray()
);

print("\n=== Uso del prefijo producto ===");
var planPrefijo = curso.polizas.find({ producto: "auto" })
  .explain("executionStats");
printjson(resumirExplicacion(planPrefijo));

print("\nCierre de la demostración:");
print("El orden del índice corresponde con dos igualdades y el ordenamiento solicitado.");
