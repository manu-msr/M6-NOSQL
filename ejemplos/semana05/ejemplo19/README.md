[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 05`](../README.md) > `Ejemplo 19`

## Ejemplo 19: Definir permisos para análisis, auditoría y administración

<div style="text-align: justify;">

### 1. Objetivo :dart:

Traducir responsabilidades de análisis, auditoría y administración a roles con
acciones y recursos explícitos, aplicando privilegio mínimo y distinguiendo la
definición de permisos de su aplicación mediante autenticación y autorización.

### 2. Requisitos :clipboard:

- Usar la terminal integrada de AWS Academy Learner Lab.
- Trabajar desde la raíz `~/m6-nosql`.
- Haber revisado la Nota 08 y los ejemplos 17 y 18.

### 3. Desarrollo :rocket:

#### Actualizar y cargar

Este es el primer ejemplo de la sesión:

```bash
cd ~/m6-nosql
git pull --ff-only
pwd
ls
bash setup/setup.sh
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  datos/semana05/cargar_datos_semana05.js
bash setup/conectar.sh
```

La instancia didáctica escucha sólo en `127.0.0.1`, contiene datos sintéticos y
no habilita autenticación. Definiremos e inspeccionaremos roles, pero no
crearemos usuarios, contraseñas ni cambiaremos el servidor para simular una
configuración de producción.

#### Partir de responsabilidades

| Perfil | Necesita | No necesita | Recurso |
|---|---|---|---|
| Análisis | Consultar variables no identificadoras | Fuente y escritura | Vista analítica |
| Auditoría | Leer casos y evidencias | Modificar datos o permisos | Dos colecciones delimitadas |
| Administración | Gestionar índices y validación | Leer datos de negocio | Colección concreta |

Autenticación respondería quién se conecta. Los roles siguientes expresan la
autorización: qué acciones tendría esa identidad sobre qué recursos.

#### Crear el recurso del perfil de análisis

```javascript
db.createView(
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
)

db.casos_analitica.findOne()
```

La vista no incluye `titular`, `polizaId` ni `descripcion`.

#### Definir el rol de análisis

```javascript
db.createRole({
  role: "analista_protegido",
  privileges: [
    {
      resource: { db: "m6_nosql", collection: "casos_analitica" },
      actions: ["find"]
    }
  ],
  roles: []
})
```

El rol no recibe `find` sobre `casos_protegidos` ni acciones de escritura.

#### Definir auditoría y administración

```javascript
db.createRole({
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
})

db.createRole({
  role: "administrador_estructura",
  privileges: [
    {
      resource: { db: "m6_nosql", collection: "casos_protegidos" },
      actions: ["listIndexes", "createIndex", "dropIndex", "collMod"]
    }
  ],
  roles: []
})
```

El perfil de auditoría puede leer sus dos recursos, pero no escribir. El perfil
administrativo puede gestionar estructura en una colección, pero no recibe
`find` por implicación.

#### Inspeccionar la definición

```javascript
db.getRole("analista_protegido", { showPrivileges: true })
db.getRole("auditor_casos", { showPrivileges: true })
db.getRole("administrador_estructura", { showPrivileges: true })
```

En una instancia con autorización habilitada, cada fila requeriría una prueba
positiva y una negativa iniciando sesión con identidades distintas. Aquí esos
rechazos no se ejecutan: sin autorización habilitada, una denegación aparente
no sería evidencia válida.

#### Recapitulación ejecutable

```bash
exit
bash ejemplos/semana05/ejemplo19/scripts/ejecutar.sh
```

La recapitulación actualiza los roles si ya existen, por lo que puede repetirse
sin almacenar secretos.

### 4. Interpretación :mag:

Los tres roles expresan fronteras diferentes. Privilegio mínimo no consiste en
asignar un rol amplio y confiar en su uso prudente, sino en omitir acciones y
recursos innecesarios. La definición de un rol tampoco habilita autenticación ni
prueba por sí sola que una operación será denegada. MongoDB y Amazon DocumentDB
pueden diferir en roles, acciones y granularidad; deben probarse por versión.

### 5. Relación con el Reto 10 :link:

El reto parte de otro conjunto sintético para construir una matriz de acceso,
una vista minimizada y pruebas positivas y negativas de diseño.

[`← Semana 05`](../README.md) | [`Ejemplo 20 →`](../ejemplo20/README.md)

</div>
