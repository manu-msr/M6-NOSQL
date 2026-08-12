var curso = db.getSiblingDB("m6_nosql");
var avisos = curso.avisos_texto;

if (avisos.countDocuments({}) !== 7) {
  throw new Error("Carga primero los datos compartidos de la semana 5.");
}

avisos.createIndex(
  { descripcion: "text" },
  { name: "descripcion_texto", default_language: "spanish" }
);

print("=== Índice de texto ===");
printjson(avisos.getIndexes());

print("\n=== Búsqueda de los términos granizo o inundación ===");
var terminos = avisos.find(
  { $text: { $search: "granizo inundación" } },
  {
    _id: 1,
    descripcion: 1,
    relevancia: { $meta: "textScore" }
  }
).sort({ relevancia: { $meta: "textScore" } }).toArray();
printjson(terminos);

print("\n=== Búsqueda de una frase ===");
var frase = avisos.find(
  { $text: { $search: "\"impacto de piedra\"" } },
  { _id: 1, descripcion: 1 }
).toArray();
printjson(frase);

print("\n=== Plan observado para inundación ===");
var explicacion = avisos.find(
  { $text: { $search: "inundación" } }
).explain("executionStats");
printjson({
  nReturned: explicacion.executionStats.nReturned,
  totalKeysExamined: explicacion.executionStats.totalKeysExamined,
  totalDocsExamined: explicacion.executionStats.totalDocsExamined,
  winningPlan: explicacion.queryPlanner.winningPlan
});

var idsTerminos = terminos.map(function (documento) {
  return documento._id;
}).sort();

if (
  JSON.stringify(idsTerminos) !== JSON.stringify(["AV-TXT-01", "AV-TXT-02", "AV-TXT-03"]) ||
  frase.length !== 1 ||
  frase[0]._id !== "AV-TXT-06"
) {
  throw new Error("Las búsquedas de texto no produjeron los resultados esperados.");
}
