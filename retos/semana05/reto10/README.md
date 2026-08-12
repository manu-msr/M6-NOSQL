[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 05`](../../../ejemplos/semana05/README.md) > `Reto 10`

## Reto 10: Diseñar acceso y protección de datos sensibles

<div style="text-align: justify;">

### 1. Objetivos :dart:

Construir una vista analítica minimizada y diseñar una matriz que relacione
perfiles, recursos, acciones concedidas, datos protegidos y pruebas positivas y
negativas mediante privilegio mínimo.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 08 y los ejemplos 19 y 20.
- Continuar en la terminal integrada del Learner Lab.
- Haber ejecutado `bash setup/setup.sh` desde `~/m6-nosql`.

### 3. Desarrollo :rocket:

#### Situación

`casos_privacidad_reto10` contiene cinco casos sintéticos con variables
operativas, financieras, identificadoras y de contacto.
`evidencias_privacidad_reto10` contiene tres referencias sintéticas.

Se requieren tres perfiles:

1. análisis consulta producto, estado, tiempo, monto, entidad y una zona postal
   generalizada, sin leer la fuente;
2. auditoría lee casos y evidencias, sin modificar datos;
3. administración gestiona índices y validación de la fuente, sin recibir
   lectura de negocio por implicación.

La instancia local no habilita autorización. Se crearán e inspeccionarán roles,
pero no usuarios ni contraseñas; las pruebas negativas se documentarán como
diseño pendiente para un entorno autenticado.

#### Cargar y comprobar los datos

```bash
cd ~/m6-nosql
pwd
bash retos/semana05/reto10/scripts/cargar_datos.sh
bash setup/conectar.sh
```

En la consola:

```javascript
db.casos_privacidad_reto10.countDocuments({})
db.evidencias_privacidad_reto10.countDocuments({})
db.casos_privacidad_reto10.findOne({ _id: "CAS-RET10-01" })
```

Las cantidades deben ser `5` y `3`.

#### Paso 1. Clasificar antes de proyectar

Relaciona cada campo con una finalidad. Distingue como mínimo:

- variables operativas necesarias;
- identificadores y contacto que deben excluirse de análisis;
- monto financiero con acceso según función;
- secretos que no deben almacenarse ni aparecer en evidencias.

Incluye combinaciones de fecha, entidad y zona dentro de la revisión; quitar el
nombre no basta para afirmar anonimato.

#### Paso 2. Construir la vista progresivamente

Inicia con un pipeline de `$project` directamente en la colección. Conserva
`producto`, `estado`, `ocurridoEn`, `montoReclamado` y entidad. Excluye `_id`,
`polizaId`, `descripcion`, `titular` y la ubicación anidada. Convierte un código
postal como `01000` en `01***` mediante `$substrCP` y `$concat`.

Ejecuta primero el pipeline:

```javascript
var pipelineVista = [ /* proyección comprobada */ ]
db.casos_privacidad_reto10.aggregate(pipelineVista).toArray()
```

Cuando la salida tenga cinco documentos y sólo los campos autorizados, crea:

```javascript
db.createView(
  "casos_analitica_reto10",
  "casos_privacidad_reto10",
  pipelineVista
)
```

#### Paso 3. Definir privilegios mínimos

Crea tres roles personalizados sin usuarios:

- `analista_reto10`: sólo `find` sobre `casos_analitica_reto10`;
- `auditor_reto10`: sólo `find` sobre casos y evidencias del reto;
- `administrador_reto10`: `listIndexes`, `createIndex`, `dropIndex` y
  `collMod` sobre la fuente, sin `find`.

Construye cada `db.createRole()` por separado y comprueba con:

```javascript
db.getRole("analista_reto10", { showPrivileges: true })
db.getRole("auditor_reto10", { showPrivileges: true })
db.getRole("administrador_reto10", { showPrivileges: true })
```

Si repites la actividad y un rol ya existe, utiliza `db.updateRole()` para
conservar el mismo nombre.

#### Paso 4. Convertir la matriz en pruebas

Para cada perfil documenta:

- recurso y acción que deben permitirse;
- operación que no se concede;
- salida o error esperado;
- límite de la evidencia disponible en este laboratorio.

La consulta de la vista y la inspección de roles son ejecutables. Una denegación
real requeriría autorización habilitada y sesiones con identidades separadas;
no presentes la ausencia de esa prueba como una denegación exitosa.

#### Conservar la solución

Después de comprobar en consola la vista y los roles, escribe `exit` y crea
copias:

```bash
cp retos/semana05/reto10/plantilla_proteccion.js \
  retos/semana05/reto10/proteccion_reto10.js
cp retos/semana05/reto10/plantilla_matriz.md \
  retos/semana05/reto10/matriz_reto10.md
nano retos/semana05/reto10/proteccion_reto10.js
```

Transfiere las definiciones ya verificadas y ejecuta:

```bash
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  retos/semana05/reto10/proteccion_reto10.js
```

#### Producto breve esperado

- `proteccion_reto10.js`, con vista y tres roles reproducibles;
- `matriz_reto10.md`, con finalidad, clasificación y pruebas por perfil;
- evidencia de cinco salidas minimizadas y privilegios inspeccionados, sin
  correos, teléfonos, nombres, contraseñas ni tokens.

#### Criterios de revisión

- La vista conserva la finalidad y excluye los campos indicados.
- La zona postal se generaliza y no se presenta como anonimización.
- Cada rol limita acciones y recursos a su responsabilidad.
- La matriz incluye una prueba positiva y una negativa por perfil.
- Las evidencias no contienen secretos ni datos de contacto.
- El alcance distingue definiciones ejecutadas de denegaciones pendientes.

#### Compatibilidad y cumplimiento

Los roles y la vista se prueban en MongoDB Community 4.4 o 7.0. Amazon
DocumentDB requiere comprobar por versión roles, acciones, vistas y
administración de identidades. Este ejercicio no certifica seguridad ni
cumplimiento normativo y no sustituye el análisis aplicable a una organización.

[`Ejemplo 20`](../../../ejemplos/semana05/ejemplo20/README.md) | [`← Semana 05`](../../../ejemplos/semana05/README.md)

</div>
