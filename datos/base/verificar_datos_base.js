var curso = db.getSiblingDB("m6_nosql");

var cantidades = {
  polizas: curso.polizas.find({}).toArray().length,
  polizas_referencias: curso.polizas_referencias.find({}).toArray().length,
  coberturas_poliza: curso.coberturas_poliza.find({}).toArray().length,
  siniestros: curso.siniestros.find({}).toArray().length
};

printjson(cantidades);

if (cantidades.polizas !== 6 || cantidades.polizas_referencias !== 6 ||
    cantidades.coberturas_poliza !== 15 || cantidades.siniestros !== 10) {
  throw new Error("La carga no coincide con las cantidades esperadas.");
}

print("Verificación correcta: 6 pólizas, 15 coberturas separadas y 10 siniestros.");
