[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 03`](../../../ejemplos/semana03/README.md) > `Reto 06`

## Reto 06: Filtrar y agrupar siniestros dentro de una zona

<div style="text-align: justify;">

### 1. Objetivos :dart:

Construir un pipeline que seleccione siniestros cerrados contenidos en una zona
y los agrupe por tipo de evento con indicadores interpretables.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 05 y las demostraciones de los ejemplos 11 y 12.
- Continuar en la terminal integrada del Learner Lab.
- Haber ejecutado `bash setup/setup.sh` desde la raíz `~/m6-nosql`.

### 3. Desarrollo :rocket:

#### Situación

`siniestros_zona_reto` contiene diez eventos sintéticos. Algunos están dentro
de `ZONA-RET-01`, otros fuera; además, no todos tienen estado `cerrado`.

Se requiere un pipeline que:

1. seleccione únicamente siniestros `cerrado`;
2. exija que `ubicacion` se encuentre dentro de `ZONA-RET-01`;
3. agrupe por `tipoEvento`;
4. calcule cantidad, monto total y monto promedio;
5. ordene por cantidad descendente, monto total descendente e identificador;
6. permita interpretar el subconjunto sin presentarlo como tasa o causalidad.

#### Cargar y comprobar los datos

Desde la terminal Bash:

```bash
cd ~/m6-nosql
pwd
bash retos/semana03/reto06/scripts/cargar_datos.sh
```

La salida debe confirmar una zona, diez siniestros y dos índices geoespaciales.
Abre la consola:

```bash
bash setup/conectar.sh
```

Comprueba:

```javascript
db.zonas_analisis_reto.countDocuments({})
db.siniestros_zona_reto.countDocuments({})
db.zonas_analisis_reto.getIndexes()
db.siniestros_zona_reto.getIndexes()
```

Las cantidades deben ser `1` y `10`; cada colección debe incluir su índice
`2dsphere`.

#### Paso 1. Recuperar la zona

```javascript
var zona = db.zonas_analisis_reto.findOne({
  _id: "ZONA-RET-01"
}).geometria
```

Inspecciona `type`, el arreglo de anillos y el cierre del anillo exterior.

#### Paso 2. Construir la selección espacial

Comienza sólo con pertenencia. Completa el operador correspondiente:

```javascript
var filtroEspacial = {
  ubicacion: {
    /* operador de pertenencia */: {
      $geometry: zona
    }
  }
}
```

Ejecuta el filtro y conserva los identificadores:

```javascript
db.siniestros_zona_reto.find(
  filtroEspacial,
  { _id: 1, estado: 1, tipoEvento: 1 }
).sort({ _id: 1 }).toArray()
```

Comprueba que cada documento devuelto esté dentro de la zona antes de agregar
otra condición.

#### Paso 3. Incorporar el filtro temático

Agrega `estado: "cerrado"` al mismo objeto y vuelve a consultar:

```javascript
db.siniestros_zona_reto.find(
  filtroEspacial,
  { _id: 1, estado: 1, tipoEvento: 1, montoReclamado: 1 }
).sort({ _id: 1 }).toArray()
```

La selección final debe contener cinco documentos. Si aparecen eventos fuera
de la zona o con otro estado, revisa la posición del operador y del filtro
temático antes de continuar.

#### Paso 4. Construir el pipeline progresivamente

Inicia con la selección ya comprobada:

```javascript
var pipeline = [
  {
    $match: filtroEspacial
  }
]

db.siniestros_zona_reto.aggregate(pipeline).toArray()
```

Agrega una etapa `$group` cuya unidad sea `tipoEvento`. Calcula:

- `eventos` con `$sum`;
- `montoTotal` con `$sum`;
- `montoPromedio` con `$avg`.

Ejecuta el pipeline después de agregar la etapa y comprueba que existan tres
grupos. Finalmente incorpora:

```javascript
{
  $sort: {
    eventos: -1,
    montoTotal: -1,
    _id: 1
  }
}
```

La salida debe ser determinista y permitir comparar tu tabla de interpretación.

#### Conservar la solución en los archivos

Después de comprobar cada etapa en la consola, escribe `exit` y crea copias:

```bash
cp retos/semana03/reto06/plantilla_pipeline.js \
  retos/semana03/reto06/pipeline_reto06.js
cp retos/semana03/reto06/plantilla_respuestas.md \
  retos/semana03/reto06/respuestas_reto06.md
```

Edita:

```bash
nano retos/semana03/reto06/pipeline_reto06.js
```

Completa la condición espacial y la etapa de agrupación con las instrucciones
que ya funcionaron en la consola. Ejecuta:

```bash
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  retos/semana03/reto06/pipeline_reto06.js
```

Si aparece `ECONNREFUSED` o faltan las colecciones:

```bash
bash setup/setup.sh
bash retos/semana03/reto06/scripts/cargar_datos.sh
```

#### Producto breve esperado

La entrega contiene:

- `pipeline_reto06.js`, ejecutable;
- `respuestas_reto06.md`, con selección, tabla e interpretación;
- evidencia donde sean visibles los cinco documentos y los tres grupos.

No se requiere un reporte extenso ni una captura de los diez documentos.

#### Criterios de revisión

- La relación espacial es pertenencia y usa la zona indicada.
- El filtro conserva sólo siniestros cerrados.
- El pipeline produce cinco seleccionados y tres grupos.
- Conteo, suma, promedio y orden corresponden con la consigna.
- La interpretación declara la unidad final y reconoce que no existe
  denominador, tasa ni evidencia de causalidad.

#### Compatibilidad

El reto se ejecuta y evalúa sobre MongoDB Community 4.4 o 7.0. Un traslado a
Amazon DocumentDB requiere verificar el operador, el índice, el pipeline y su
comportamiento en la versión objetivo.

<br/>

[`Ejemplo 12`](../../../ejemplos/semana03/ejemplo12/README.md) | [`← Semana 03`](../../../ejemplos/semana03/README.md)

</div>
