[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 01`](../../../ejemplos/semana01/README.md) > `Reto 02`

## Reto 02: Construir un pipeline de frecuencia y monto

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Construir un pipeline multietapa para resumir datos de siniestros.
- Describir la frecuencia y el monto reclamado por producto y cobertura.
- Interpretar los resultados y reconocer los límites del resumen obtenido.

### 2. Requisitos :clipboard:

- Haber revisado la Nota 02 y las demostraciones de los ejemplos 03 y 04.
- Continuar en la terminal integrada del Learner Lab.
- Haber clonado `https://github.com/manu-msr/M6-NOSQL` y ejecutado
  `bash setup/setup.sh` desde la carpeta `repositorio`.

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

#### Carga y comprobación de los datos

Desde la terminal Bash del Learner Lab, las siguientes líneas entran a la
carpeta correcta y cargan los datos exclusivos del reto:

```bash
cd ~/m6-nosql/repositorio
pwd
bash retos/semana01/reto02/scripts/cargar_datos.sh
```

`pwd` debe mostrar una ruta terminada en `/m6-nosql/repositorio`. La salida del
lanzador debe confirmar 5 pólizas y 8 siniestros.

La carga se comprueba en la consola de MongoDB con:

```bash
bash setup/conectar.sh
```

Cuando aparezca `m6_nosql>`, se ejecuta una línea a la vez:

```javascript
db.polizas_agregacion_reto.countDocuments({})
db.siniestros_agregacion_reto.countDocuments({})
```

Las respuestas esperadas son `5` y `8`. La instrucción `exit` seguida de
`Enter` cierra la consola y devuelve la terminal Bash.

#### Preparación de los archivos de trabajo

Desde `/m6-nosql/repositorio`, estas líneas crean copias editables de las
plantillas:

```bash
cp retos/semana01/reto02/plantilla_pipeline.js \
  retos/semana01/reto02/pipeline_reto02.js
cp retos/semana01/reto02/plantilla_respuestas.md \
  retos/semana01/reto02/respuestas_reto02.md
```

El pipeline se abre en el editor de la terminal con:

```bash
nano retos/semana01/reto02/pipeline_reto02.js
```

En `nano`, `Ctrl+O` guarda, `Enter` confirma el nombre y `Ctrl+X` cierra el
editor. El mismo procedimiento se usa para las respuestas:

```bash
nano retos/semana01/reto02/respuestas_reto02.md
```

Si aparece `nano: command not found`, se conserva el mensaje y se comunica al
docente antes de utilizar otro editor.

#### Consigna del pipeline

El arreglo `pipeline` de `pipeline_reto02.js` debe contener, en este orden
lógico, las transformaciones necesarias para:

1. conservar solamente documentos con `estado: "en_revision"` y
   `fechaOcurrencia` desde `2026-01-01T00:00:00Z` hasta antes de
   `2026-07-01T00:00:00Z`;
2. relacionar `polizaId` con `_id` en `polizas_agregacion_reto` mediante
   `$lookup`;
3. individualizar la póliza coincidente y cada elemento de
   `coberturasAfectadas` mediante `$unwind`;
4. formar un grupo por producto y cobertura;
5. calcular para cada grupo:
   - `frecuencia`, con el número de apariciones;
   - `montoReclamadoTotal`, con la suma de `montoReclamado`;
   - `montoReclamadoPromedio`, con el promedio de `montoReclamado`;
6. producir documentos sin `_id` y con los campos `producto`, `cobertura`,
   `frecuencia`, `montoReclamadoTotal` y `montoReclamadoPromedio`;
7. ordenar por `frecuencia` descendente, después por
   `montoReclamadoTotal` descendente y usar producto y cobertura como
   desempates ascendentes.

La solución debe usar las etapas estudiadas en la Nota 02. No se requieren
operadores de semanas posteriores.

#### Ejecución y comprobación

Desde la raíz de `repositorio`, el archivo terminado se ejecuta con:

```bash
./.tools/bin/mongosh \
  "mongodb://127.0.0.1:27017/m6_nosql?directConnection=true" \
  --quiet \
  retos/semana01/reto02/pipeline_reto02.js
```

La salida correcta contiene cuatro documentos de resumen y no muestra errores.
No se proporciona aquí su contenido ni su orden: forman parte de la evidencia
que debe interpretarse.

Si aparece `ECONNREFUSED`, las siguientes líneas reinician el entorno, recargan
los datos y permiten repetir la ejecución:

```bash
bash setup/setup.sh
bash retos/semana01/reto02/scripts/cargar_datos.sh
```

#### Interpretación requerida

En `respuestas_reto02.md` se registran respuestas breves para:

1. identificar la unidad que representa cada documento final;
2. señalar el grupo con mayor frecuencia y sustentar la afirmación con la
   salida;
3. explicar por qué un siniestro con dos coberturas aparece en dos grupos;
4. indicar por qué no deben sumarse los montos de todos los grupos como si
   fueran el monto total único de los siniestros;
5. mencionar una conclusión que no pueda obtenerse con estos datos.

#### Producto breve esperado

La entrega contiene solamente:

- `pipeline_reto02.js`, ejecutable y sin mensajes de error;
- `respuestas_reto02.md`, con la interpretación solicitada;
- evidencia pertinente de la ejecución donde sean visibles el comando y los
  cuatro documentos finales.

No se requiere un reporte extenso ni se agregan credenciales, direcciones
externas o certificados.

#### Criterios de revisión

- El filtro temporal y de estado conserva el universo solicitado.
- La relación entre colecciones y los dos cambios de unidad son correctos.
- Los acumuladores calculan frecuencia, suma y promedio por grupo.
- La salida tiene los campos y el orden indicados.
- La interpretación reconoce la posible repetición del monto después de
  descomponer el arreglo.

#### Relación con los ejemplos

- El Ejemplo 03 muestra cómo leer `$match`, `$project` y `$sort` en secuencia.
- El Ejemplo 04 muestra el cambio de unidad producido por `$lookup` y
  `$unwind`, seguido por un resumen con `$group`.
- El reto integra esas decisiones con datos distintos y concentra la práctica
  de la sesión.

#### Nota docente

La carpeta `solucion_docente` se mantiene fuera de la versión del repositorio
que se distribuya al estudiantado.

<br/>

[`Anterior`](../../../ejemplos/semana01/ejemplo04/README.md) | [`Siguiente`](../../../ejemplos/semana02/README.md)

</div>
