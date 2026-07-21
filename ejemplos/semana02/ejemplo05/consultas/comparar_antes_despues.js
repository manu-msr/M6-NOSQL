var curso = db.getSiblingDB("m6_nosql");

var consulta = {
  estado: "vigente",
  "vigencia.inicio": { $gte: ISODate("2026-01-01T00:00:00Z") }
};

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
  return {
    etapas: etapas.filter(function (etapa, posicion) {
      return etapas.indexOf(etapa) === posicion;
    }),
    nReturned: explicacion.executionStats.nReturned,
    totalKeysExamined: explicacion.executionStats.totalKeysExamined,
    totalDocsExamined: explicacion.executionStats.totalDocsExamined,
    executionTimeMillis: explicacion.executionStats.executionTimeMillis
  };
}

curso.polizas.dropIndexes();

print("\n=== Consulta evaluada ===");
printjson(consulta);

print("\n=== Antes de crear el índice ===");
var antes = curso.polizas.find(consulta).explain("executionStats");
printjson(resumirExplicacion(antes));

print("\n=== Creación del índice ===");
var nombreIndice = curso.polizas.createIndex(
  { estado: 1, "vigencia.inicio": 1 },
  { name: "estado_1_vigencia_inicio_1" }
);
print("Índice creado: " + nombreIndice);

print("\n=== Después de crear el índice ===");
var despues = curso.polizas.find(consulta).explain("executionStats");
printjson(resumirExplicacion(despues));

print("\n=== Resultado de la consulta ===");
printjson(
  curso.polizas.find(
    consulta,
    { _id: 1, estado: 1, "vigencia.inicio": 1 }
  ).sort({ _id: 1 }).toArray()
);

print("\nCierre de la demostración:");
print("La respuesta no cambió; el índice redujo el trabajo registrado por el plan.");
