var curso = db.getSiblingDB("m6_nosql");

curso.casos_privacidad_reto10.drop();
curso.evidencias_privacidad_reto10.drop();
curso.casos_analitica_reto10.drop();

curso.casos_privacidad_reto10.insertMany([
  {
    _id: "CAS-RET10-01",
    polizaId: "POL-RET10-201",
    producto: "Auto",
    estado: "abierto",
    ocurridoEn: new Date("2026-06-03T10:00:00Z"),
    montoReclamado: 42000,
    descripcion: "Afectación por granizo",
    titular: { idInterno: "TIT-RET10-01", nombre: "Persona reto 01", correo: "reto01@example.invalid", telefono: "0000000101" },
    ubicacion: { entidad: "CDMX", codigoPostal: "01000" }
  },
  {
    _id: "CAS-RET10-02",
    polizaId: "POL-RET10-202",
    producto: "Hogar",
    estado: "cerrado",
    ocurridoEn: new Date("2026-06-06T15:30:00Z"),
    montoReclamado: 70000,
    descripcion: "Daño por fuga de agua",
    titular: { idInterno: "TIT-RET10-02", nombre: "Persona reto 02", correo: "reto02@example.invalid", telefono: "0000000102" },
    ubicacion: { entidad: "Puebla", codigoPostal: "72000" }
  },
  {
    _id: "CAS-RET10-03",
    polizaId: "POL-RET10-203",
    producto: "Auto",
    estado: "abierto",
    ocurridoEn: new Date("2026-06-11T08:20:00Z"),
    montoReclamado: 26000,
    descripcion: "Impacto en parabrisas",
    titular: { idInterno: "TIT-RET10-03", nombre: "Persona reto 03", correo: "reto03@example.invalid", telefono: "0000000103" },
    ubicacion: { entidad: "Jalisco", codigoPostal: "44100" }
  },
  {
    _id: "CAS-RET10-04",
    polizaId: "POL-RET10-204",
    producto: "Hogar",
    estado: "abierto",
    ocurridoEn: new Date("2026-06-17T19:45:00Z"),
    montoReclamado: 95000,
    descripcion: "Daño por incendio en cocina",
    titular: { idInterno: "TIT-RET10-04", nombre: "Persona reto 04", correo: "reto04@example.invalid", telefono: "0000000104" },
    ubicacion: { entidad: "CDMX", codigoPostal: "03100" }
  },
  {
    _id: "CAS-RET10-05",
    polizaId: "POL-RET10-205",
    producto: "Vida",
    estado: "en_revision",
    ocurridoEn: new Date("2026-06-24T12:10:00Z"),
    montoReclamado: 140000,
    descripcion: "Documentación incompleta",
    titular: { idInterno: "TIT-RET10-05", nombre: "Persona reto 05", correo: "reto05@example.invalid", telefono: "0000000105" },
    ubicacion: { entidad: "Querétaro", codigoPostal: "76000" }
  }
]);

curso.evidencias_privacidad_reto10.insertMany([
  { _id: "EVI-RET10-01", casoId: "CAS-RET10-01", tipo: "fotografia", recibidoEn: new Date("2026-06-03T11:00:00Z") },
  { _id: "EVI-RET10-02", casoId: "CAS-RET10-02", tipo: "dictamen", recibidoEn: new Date("2026-06-07T09:00:00Z") },
  { _id: "EVI-RET10-03", casoId: "CAS-RET10-04", tipo: "fotografia", recibidoEn: new Date("2026-06-17T20:30:00Z") }
]);

if (
  curso.casos_privacidad_reto10.countDocuments({}) !== 5 ||
  curso.evidencias_privacidad_reto10.countDocuments({}) !== 3
) {
  throw new Error("La carga del Reto 10 no produjo las cantidades esperadas.");
}

print("Datos del Reto 10 cargados.");
print("5 casos y 3 evidencias completamente sintéticos.");
