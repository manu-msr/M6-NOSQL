[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 01`](../../../ejemplos/semana01/README.md) > `Reto 02`

## Reto 02: Construir un pipeline de frecuencia y monto

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Construir y comprobar un pipeline multietapa en la consola.
- Describir la frecuencia y el monto reclamado por producto y cobertura.
- Interpretar los resultados y reconocer los límites del resumen obtenido.
- Conservar el pipeline comprobado como un archivo reproducible.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 02 y las demostraciones de los ejemplos 03 y 04.
- Continuar en la terminal integrada del Learner Lab.
- Haber actualizado el repositorio al comenzar el Ejemplo 03.
- Conservar las herramientas preparadas durante la Sesión 1.

### 3. Desarrollo :rocket:

#### Situación

Se dispone de un conjunto sintético distinto al de los ejemplos. Se requiere
describir los siniestros `en_revision` ocurridos durante el primer semestre de
2026 mediante esta pregunta:

> ¿Cómo se distribuyen la frecuencia y el monto reclamado por producto y
> cobertura afectada?

`siniestros_agregacion_reto` contiene la fecha, el estado, el monto, la póliza
relacionada y un arreglo de coberturas afectadas. `polizas_agregacion_reto`
contiene el producto de cada póliza.

#### Cargar y comprobar los datos

Desde la terminal Bash del Learner Lab, entra a la carpeta correcta y carga los
datos exclusivos del reto:

```bash
cd ~/m6-nosql
pwd
bash retos/semana01/reto02/scripts/cargar_datos.sh
```

`pwd` debe mostrar una ruta terminada en `/m6-nosql`. La salida del lanzador
debe confirmar 5 pólizas y 8 siniestros.

Abre la consola:

```bash
bash setup/conectar.sh
```

Cuando aparezca `m6_nosql>` o `>`, ejecuta una línea a la vez:

```javascript
db.polizas_agregacion_reto.countDocuments({})
db.siniestros_agregacion_reto.countDocuments({})
```

Las respuestas esperadas son `5` y `8`. Mantén abierta la consola: primero
construirás y comprobarás ahí el pipeline.

#### Construir el pipeline paso a paso

Comienza con:

```javascript
db.siniestros_agregacion_reto.aggregate([
  // Agrega aquí la primera etapa.
]).toArray()
```

Sustituye el comentario por la primera etapa y ejecuta la consulta. Después
recupérala con la tecla de flecha hacia arriba, añade una nueva etapa y vuelve a
observar la salida. Sigue este orden lógico:

1. `$match`: conserva documentos con `estado: "en_revision"` y
   `fechaOcurrencia` desde `2026-01-01T00:00:00Z` hasta antes de
   `2026-07-01T00:00:00Z`;
2. `$lookup`: relaciona `polizaId` con `_id` en
   `polizas_agregacion_reto`;
3. primer `$unwind`: individualiza la póliza coincidente;
4. segundo `$unwind`: individualiza cada elemento de
   `coberturasAfectadas`;
5. `$group`: forma un grupo por producto y cobertura, y calcula:
   - `frecuencia`, con el número de apariciones;
   - `montoReclamadoTotal`, con la suma de `montoReclamado`;
   - `montoReclamadoPromedio`, con el promedio de `montoReclamado`;
6. las etapas necesarias para producir documentos sin `_id` y con los campos
   `producto`, `cobertura`, `frecuencia`, `montoReclamadoTotal` y
   `montoReclamadoPromedio`;
7. `$sort`: ordena por `frecuencia` descendente, después por
   `montoReclamadoTotal` descendente y utiliza producto y cobertura como
   desempates ascendentes.

Detente después de cada ejecución y revisa una propiedad observable:

- después de `$match`, la fecha y el estado de los documentos conservados;
- después de `$lookup`, el arreglo que contiene la póliza relacionada;
- después de cada `$unwind`, la unidad representada por cada documento;
- después de `$group`, la clave y los acumuladores de cada resumen;
- al final, los nombres de los campos y el orden de los resultados.

La solución debe usar las etapas estudiadas en la Nota 02. No se requieren
operadores de semanas posteriores. La salida final correcta contiene cuatro
documentos de resumen y no muestra errores; su contenido y orden forman parte
de la evidencia que debes interpretar.

Cuando el pipeline esté completo y comprobado, recupéralo con la tecla de
flecha hacia arriba, selecciónalo y utiliza la opción **Copiar** del menú
contextual de la terminal. Después escribe `exit` para volver a Bash.

#### Conservar el pipeline comprobado

Ahora crea las copias de las plantillas:

```bash
cp retos/semana01/reto02/plantilla_pipeline.js \
  retos/semana01/reto02/pipeline_reto02.js
cp retos/semana01/reto02/plantilla_respuestas.md \
  retos/semana01/reto02/respuestas_reto02.md
nano retos/semana01/reto02/pipeline_reto02.js
```

Reemplaza `null` por el pipeline completo que ya funcionó en la consola,
incluidos `aggregate(...)` y `.toArray()`. No necesitas aprender otra forma de
armarlo: el archivo `.js` es la recapitulación de una consulta que ya razonaste
y verificaste. Pega la instrucción que copiaste antes de cerrar la consola.

En `nano`, `Ctrl+O` guarda, `Enter` confirma el nombre y `Ctrl+X` cierra el
editor.
Si aparece `nano: command not found`, conserva el mensaje y comunícalo al
docente antes de utilizar otro editor.

Ejecuta el archivo terminado desde la raíz del repositorio:

```bash
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  retos/semana01/reto02/pipeline_reto02.js
```

La salida debe coincidir con los cuatro documentos obtenidos en la consola. Si
aparece `ECONNREFUSED`, reinicia el entorno, recarga los datos y repite la
ejecución:

```bash
bash setup/setup.sh
bash retos/semana01/reto02/scripts/cargar_datos.sh
```

#### Interpretar el resultado

Abre la plantilla de respuestas:

```bash
nano retos/semana01/reto02/respuestas_reto02.md
```

Registra respuestas breves para:

1. identificar la unidad que representa cada documento final;
2. señalar el grupo con mayor frecuencia y sustentar la afirmación con la
   salida;
3. explicar por qué un siniestro con dos coberturas aparece en dos grupos;
4. indicar por qué no deben sumarse los montos de todos los grupos como si
   fueran el monto total único de los siniestros;
5. mencionar una conclusión que no pueda obtenerse con estos datos.

Guarda y cierra el editor.

#### Producto breve esperado

La entrega contiene solamente:

- `pipeline_reto02.js`, con el pipeline comprobado y sin mensajes de error;
- `respuestas_reto02.md`, con la interpretación solicitada;
- evidencia pertinente de la ejecución donde sean visibles el comando y los
  cuatro documentos finales.

No se requiere un reporte extenso ni se agregan credenciales, direcciones
externas o certificados.

#### Criterios de revisión

- El pipeline se construyó y verificó progresivamente en la consola.
- El filtro temporal y de estado conserva el universo solicitado.
- La relación entre colecciones y los dos cambios de unidad son correctos.
- Los acumuladores calculan frecuencia, suma y promedio por grupo.
- El archivo conserva la consulta final con los campos y el orden indicados.
- La interpretación reconoce la posible repetición del monto después de
  descomponer el arreglo.

#### Relación con los ejemplos

- El Ejemplo 03 muestra cómo construir `$match`, `$project` y `$sort` en
  secuencia.
- El Ejemplo 04 muestra el cambio de unidad producido por `$lookup` y
  `$unwind`, seguido por un resumen con `$group`.
- El reto integra esas decisiones con datos distintos y conserva el resultado
  comprobado únicamente al final.

<br/>

[`Anterior`](../../../ejemplos/semana01/ejemplo04/README.md) | [`Siguiente`](../../../ejemplos/semana02/README.md)

</div>
