var curso = db.getSiblingDB("m6_nosql");

if (
  curso.casos_protegidos.countDocuments({}) !== 4 ||
  curso.evidencias_protegidas.countDocuments({}) !== 3
) {
  throw new Error("Carga primero los datos compartidos de la semana 5.");
}

curso.casos_analitica.drop();
curso.createView(
  "casos_analitica",
  "casos_protegidos",
  [
    {
      $project: {
        _id: 1,
        producto: 1,
        estado: 1,
        ocurridoEn: 1,
        montoReclamado: 1,
        entidad: "$ubicacion.entidad",
        zonaPostal: {
          $concat: [
            { $substrCP: ["$ubicacion.codigoPostal", 0, 2] },
            "***"
          ]
        }
      }
    }
  ]
);

var especificaciones = [
  {
    role: "analista_protegido",
    privileges: [
      {
        resource: { db: "m6_nosql", collection: "casos_analitica" },
        actions: ["find"]
      }
    ],
    roles: []
  },
  {
    role: "auditor_casos",
    privileges: [
      {
        resource: { db: "m6_nosql", collection: "casos_protegidos" },
        actions: ["find"]
      },
      {
        resource: { db: "m6_nosql", collection: "evidencias_protegidas" },
        actions: ["find"]
      }
    ],
    roles: []
  },
  {
    role: "administrador_estructura",
    privileges: [
      {
        resource: { db: "m6_nosql", collection: "casos_protegidos" },
        actions: ["listIndexes", "createIndex", "dropIndex", "collMod"]
      }
    ],
    roles: []
  }
];

especificaciones.forEach(function (especificacion) {
  var existente = curso.getRole(especificacion.role);
  if (existente) {
    curso.updateRole(especificacion.role, {
      privileges: especificacion.privileges,
      roles: especificacion.roles
    });
  } else {
    curso.createRole(especificacion);
  }
});

print("=== Matriz de responsabilidades ===");
printjson([
  {
    perfil: "analisis",
    permitido: "find en casos_analitica",
    noConcedido: "lectura de casos_protegidos o escritura"
  },
  {
    perfil: "auditoria",
    permitido: "find en casos_protegidos y evidencias_protegidas",
    noConcedido: "modificar casos o administrar permisos"
  },
  {
    perfil: "administracion",
    permitido: "gestionar índices y validación de casos_protegidos",
    noConcedido: "find sobre datos de negocio"
  }
]);

print("\n=== Roles personalizados ===");
var roles = especificaciones.map(function (especificacion) {
  return curso.getRole(especificacion.role, { showPrivileges: true });
});
printjson(roles);

print("\n=== Recurso analítico que usaría el primer rol ===");
printjson(curso.casos_analitica.findOne({ _id: "CAS-SINT-001" }));

if (
  roles.some(function (rol) { return !rol; }) ||
  curso.casos_analitica.countDocuments({ titular: { $exists: true } }) !== 0
) {
  throw new Error("La definición de roles o la vista analítica quedó incompleta.");
}
