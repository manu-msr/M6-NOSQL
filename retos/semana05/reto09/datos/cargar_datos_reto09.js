var curso = db.getSiblingDB("m6_nosql");

curso.reportes_busqueda_reto09.drop();

curso.reportes_busqueda_reto09.insertMany([
  { _id: "RET-BUS-01", codigo: "HOG-CDMX-101", producto: "Hogar", estado: "abierto", descripcion: "Ingreso de agua por inundación en planta baja" },
  { _id: "RET-BUS-02", codigo: "HOG-PUE-102", producto: "Hogar", estado: "abierto", descripcion: "Fuga de tubería en la cocina" },
  { _id: "RET-BUS-03", codigo: "REP-HOG-103", producto: "Hogar", estado: "abierto", descripcion: "Reporte complementario por INUNDACIÓN en sótano" },
  { _id: "RET-BUS-04", codigo: "HOG-GDL-104", producto: "Hogar", estado: "cerrado", descripcion: "Daño por agua de lluvia en la azotea" },
  { _id: "RET-BUS-05", codigo: "AUT-CDMX-105", producto: "Auto", estado: "abierto", descripcion: "Ingreso de agua al motor" },
  { _id: "RET-BUS-06", codigo: "HOG-CDMX-ABC", producto: "Hogar", estado: "abierto", descripcion: "Afectación por granizo en ventanas" },
  { _id: "RET-BUS-07", codigo: "HOG-XX-107", producto: "Hogar", estado: "abierto", descripcion: "Daño por humo en habitación" },
  { _id: "RET-BUS-08", codigo: "COM-HOG-108", producto: "Comercio", estado: "abierto", descripcion: "Humedad en almacén" },
  { _id: "RET-BUS-09", codigo: "HOG-MTY-109", producto: "Hogar", estado: "abierto", descripcion: "Cristal roto por impacto" },
  { _id: "RET-BUS-10", codigo: "HOG-QRO-110", producto: "Hogar", estado: "abierto", descripcion: "Daño por desbordamiento en patio" }
]);

if (curso.reportes_busqueda_reto09.countDocuments({}) !== 10) {
  throw new Error("La carga del Reto 09 no produjo diez reportes.");
}

print("Datos del Reto 09 cargados.");
print("10 reportes sintéticos; no se creó ningún índice adicional.");
