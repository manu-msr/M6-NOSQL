var curso = db.getSiblingDB("m6_nosql");
var avisos = curso.avisos_texto;

if (avisos.countDocuments({}) !== 7) {
  throw new Error("Carga primero los datos compartidos de la semana 5.");
}

avisos.createIndex({ codigo: 1 }, { name: "codigo_asc" });

function ids(cursor) {
  return cursor.toArray().map(function (documento) {
    return documento._id;
  });
}

print("=== AUT en cualquier posición ===");
var sinAncla = ids(
  avisos.find({ codigo: /AUT/ }, { _id: 1 }).sort({ _id: 1 })
);
printjson(sinAncla);

print("\n=== Prefijo AUT- ===");
var conAncla = ids(
  avisos.find({ codigo: /^AUT-/ }, { _id: 1 }).sort({ _id: 1 })
);
printjson(conAncla);

print("\n=== Estructura completa HOG-REGION-NNN ===");
var estructura = ids(
  avisos.find(
    { codigo: /^HOG-[A-Z]{3,4}-[0-9]{3}$/ },
    { _id: 1, codigo: 1 }
  ).sort({ _id: 1 })
);
printjson(estructura);

print("\n=== Auto abierto que menciona granizo o piedra ===");
var combinada = ids(
  avisos.find(
    {
      producto: "Auto",
      estado: "abierto",
      descripcion: /granizo|piedra/i
    },
    { _id: 1, descripcion: 1 }
  ).sort({ _id: 1 })
);
printjson(combinada);

print("\n=== Categoría calculada mediante patrones ordenados ===");
var categorias = avisos.aggregate([
  {
    $project: {
      _id: 1,
      codigo: 1,
      categoriaCalculada: {
        $switch: {
          branches: [
            {
              case: { $regexMatch: { input: "$codigo", regex: /^AUT-/ } },
              then: "auto"
            },
            {
              case: { $regexMatch: { input: "$codigo", regex: /^HOG-/ } },
              then: "hogar"
            },
            {
              case: { $regexMatch: { input: "$codigo", regex: /^VID-/ } },
              then: "vida"
            }
          ],
          default: "revision_manual"
        }
      }
    }
  },
  { $sort: { _id: 1 } }
]).toArray();
printjson(categorias);

print("\n=== Plan observado para el prefijo AUT- ===");
var explicacion = avisos.find({ codigo: /^AUT-/ }).explain("executionStats");
printjson({
  nReturned: explicacion.executionStats.nReturned,
  totalKeysExamined: explicacion.executionStats.totalKeysExamined,
  totalDocsExamined: explicacion.executionStats.totalDocsExamined,
  winningPlan: explicacion.queryPlanner.winningPlan
});

if (
  JSON.stringify(sinAncla) !== JSON.stringify(["AV-TXT-01", "AV-TXT-02", "AV-TXT-06", "AV-TXT-07"]) ||
  JSON.stringify(conAncla) !== JSON.stringify(["AV-TXT-01", "AV-TXT-02", "AV-TXT-06"]) ||
  JSON.stringify(estructura) !== JSON.stringify(["AV-TXT-03", "AV-TXT-04"]) ||
  JSON.stringify(combinada) !== JSON.stringify(["AV-TXT-01", "AV-TXT-06"]) ||
  categorias[6].categoriaCalculada !== "revision_manual"
) {
  throw new Error("Las búsquedas mediante patrones no produjeron los resultados esperados.");
}
