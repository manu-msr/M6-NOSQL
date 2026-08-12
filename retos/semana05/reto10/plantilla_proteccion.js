var curso = db.getSiblingDB("m6_nosql");
var casos = curso.casos_privacidad_reto10;

if (
  casos.countDocuments({}) !== 5 ||
  curso.evidencias_privacidad_reto10.countDocuments({}) !== 3
) {
  throw new Error("Carga primero los datos del Reto 10.");
}

curso.casos_analitica_reto10.drop();

var pipelineVista = [
  {
    $project: {
      _id: 0,
      producto: 1,
      estado: 1,
      ocurridoEn: 1,
      montoReclamado: 1,
      entidad: "$ubicacion.entidad",
      zonaPostal: null // Generaliza el código postal a sus dos primeros caracteres.
    }
  }
];

if (pipelineVista[0].$project.zonaPostal === null) {
  throw new Error("Completa la generalización de zonaPostal.");
}

curso.createView(
  "casos_analitica_reto10",
  "casos_privacidad_reto10",
  pipelineVista
);

var especificacionesRoles = [
  {
    role: "analista_reto10",
    privileges: [], // Concede sólo find sobre la vista.
    roles: []
  },
  {
    role: "auditor_reto10",
    privileges: [], // Concede find sobre casos y evidencias, sin escritura.
    roles: []
  },
  {
    role: "administrador_reto10",
    privileges: [], // Concede acciones de estructura, sin find de negocio.
    roles: []
  }
];

if (especificacionesRoles.some(function (rol) { return rol.privileges.length === 0; })) {
  throw new Error("Completa los privilegios mínimos de los tres roles.");
}

especificacionesRoles.forEach(function (especificacion) {
  if (curso.getRole(especificacion.role)) {
    curso.updateRole(especificacion.role, {
      privileges: especificacion.privileges,
      roles: especificacion.roles
    });
  } else {
    curso.createRole(especificacion);
  }
});

print("=== Vista analítica del Reto 10 ===");
var salida = curso.casos_analitica_reto10.find({}).sort({ ocurridoEn: 1 }).toArray();
printjson(salida);

print("\n=== Roles definidos ===");
var roles = especificacionesRoles.map(function (especificacion) {
  return curso.getRole(especificacion.role, { showPrivileges: true });
});
printjson(roles);

var prohibidos = ["_id", "polizaId", "descripcion", "titular", "ubicacion"];
var exponeCampo = salida.some(function (documento) {
  return prohibidos.some(function (campo) {
    return Object.prototype.hasOwnProperty.call(documento, campo);
  });
});

if (salida.length !== 5 || exponeCampo || roles.some(function (rol) { return !rol; })) {
  throw new Error("La vista o los roles no cumplen la especificación del reto.");
}
