var curso = db.getSiblingDB("m6_nosql");
var reportes = curso.reportes_busqueda_reto09;

if (reportes.countDocuments({}) !== 10) {
  throw new Error("Carga primero los datos del Reto 09.");
}

var estrategia = ""; // Escribe "texto" o "patron".

var definicionIndice = {
  campos: {}, // Índice de texto sobre descripción o índice ascendente sobre código.
  opciones: {} // Incluye un nombre y, si corresponde, el idioma.
};

var filtro = null; // Transfiere aquí el filtro ya comprobado en la consola.

if (
  estrategia !== "texto" && estrategia !== "patron" ||
  Object.keys(definicionIndice.campos).length === 0 ||
  filtro === null
) {
  throw new Error("Completa la estrategia, el índice y el filtro elegidos.");
}

reportes.createIndex(definicionIndice.campos, definicionIndice.opciones);

var resultado = reportes.find(
  filtro,
  { _id: 1, codigo: 1, producto: 1, estado: 1, descripcion: 1 }
).sort({ _id: 1 }).toArray();

print("=== Estrategia elegida: " + estrategia + " ===");
printjson(resultado);

print("\n=== Plan observado ===");
var explicacion = reportes.find(filtro).explain("executionStats");
printjson({
  nReturned: explicacion.executionStats.nReturned,
  totalKeysExamined: explicacion.executionStats.totalKeysExamined,
  totalDocsExamined: explicacion.executionStats.totalDocsExamined,
  winningPlan: explicacion.queryPlanner.winningPlan
});

if (resultado.length === 0) {
  throw new Error("La estrategia no recuperó ningún caso de control.");
}
