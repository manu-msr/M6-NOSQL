[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 01`](../README.md) > `Ejemplo 01`

## Ejemplo 01: Recorrer y preparar el entorno de trabajo

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Reconocer los espacios de trabajo disponibles en AWS Academy.
- Distinguir la terminal Bash de la consola de MongoDB.
- Observar la configuración inicial de MongoDB dentro del Learner Lab.
- Comprobar paso a paso la base, sus colecciones y un documento de ejemplo.

### 2. Requisitos :clipboard:

1. Haber revisado la Nota 01.
2. Seguir la demostración realizada por el docente.
3. Tener a la mano el
   [manual de configuración](../../../docs/inicio_learner_lab.md) para
   consultarlo cuando se prepare la instancia individual.

> En este ejemplo el docente escribirá y explicará cada comando. No necesitas
> configurar todavía tu instancia ni copiar las instrucciones durante la
> demostración.

### 3. Desarrollo :rocket:

#### Paso 1. Reconocer los espacios de trabajo

El docente mostrará la diferencia entre el aula de AWS Academy, donde se
consultan materiales y entregas, y el Learner Lab, donde se encuentra la
terminal utilizada para ejecutar los recursos técnicos del módulo.

También señalará el indicador de Bash. Éste suele terminar con el símbolo `$` y
acepta comandos para desplazarse entre directorios, obtener el repositorio y
ejecutar herramientas.

#### Paso 2. Obtener el repositorio

Desde la terminal integrada, el docente escribirá una instrucción a la vez:

```bash
cd ~
git clone https://github.com/manu-msr/M6-NOSQL.git m6-nosql
cd m6-nosql
pwd
ls
```

Después de cada instrucción se comprobará qué cambió. `pwd` debe mostrar una
ruta terminada en `/m6-nosql`; `ls` debe incluir `datos`, `ejemplos`, `retos` y
`setup`. En este punto seguimos en Bash.

#### Paso 3. Configurar MongoDB

La preparación se inicia desde la raíz del repositorio:

```bash
bash setup/setup.sh
```

El docente explicará los mensajes conforme aparezcan: detección del sistema,
instalación de las herramientas dentro del clon, inicio del servidor y carga de
la base `m6_nosql`. La preparación termina correctamente cuando aparece:

```text
Preparación completa. MongoDB está activo y la base m6_nosql está poblada.
```

#### Paso 4. Abrir la consola de MongoDB

Desde Bash se escribe:

```bash
bash setup/conectar.sh
```

El indicador cambia a `m6_nosql>` o, en la consola clásica, a `>`. A partir de
este momento se escribirán consultas de MongoDB, no comandos de Bash.

#### Paso 5. Comprobar la base activa

La primera pregunta es: **¿en qué base estamos trabajando?**

```javascript
db.getName()
```

La respuesta debe ser `m6_nosql`. Esta comprobación evita ejecutar una consulta
en una base distinta por accidente.

#### Paso 6. Comprobar la conexión

Ahora preguntamos: **¿responde el servidor?**

```javascript
db.runCommand({ ping: 1 })
```

El resultado debe incluir `ok: 1`. El comando no consulta pólizas ni
siniestros; únicamente confirma que la conexión funciona.

#### Paso 7. Reconocer las colecciones

Para saber qué conjuntos de documentos están disponibles se escribe:

```javascript
show collections
```

La salida debe incluir `polizas`, `polizas_referencias`,
`coberturas_poliza` y `siniestros`.

#### Paso 8. Contar documentos

Primero contamos las pólizas y después los siniestros:

```javascript
db.polizas.countDocuments({})
```

```javascript
db.siniestros.countDocuments({})
```

El filtro vacío `{}` significa que se consideran todos los documentos. Las
respuestas esperadas son seis pólizas y diez siniestros.

#### Paso 9. Inspeccionar un documento

Finalmente preguntamos: **¿qué estructura tiene una póliza concreta?**

```javascript
db.polizas.findOne({ _id: "POL-1001" })
```

La salida permite reconocer campos simples, el documento anidado `vigencia` y
el arreglo `coberturas`. Para regresar a Bash se escribe:

```javascript
exit
```

#### Interpretación

La terminal Bash administra el entorno; la consola de MongoDB permite formular
preguntas sobre la base. Cada instrucción anterior respondió una pregunta
distinta y se comprobó antes de continuar. La instancia utiliza datos
sintéticos y sólo escucha dentro del Learner Lab; no representa una
configuración de producción.

#### Relación con el Reto 01

En el reto repetirás la configuración en tu propia instancia, comprobarás que
la base responda y construirás una consulta breve directamente en la consola.

#### Recapitulación en un archivo `.js`

Después de comprender y ejecutar las comprobaciones una por una, el archivo
[`recorrer_entorno.js`](consultas/recorrer_entorno.js) las reúne para poder
repetir el recorrido. No introduce una solución nueva: funciona como una
bitácora ejecutable de lo que ya se razonó en vivo.

Desde Bash puede reproducirse la recapitulación con:

```bash
bash ejemplos/semana01/ejemplo01/scripts/ejecutar.sh
```

La salida debe confirmar cuatro colecciones base, seis pólizas y diez
siniestros, y mostrar la estructura de `POL-1001`.

<br/>

[`Semana 01`](../README.md) | [`Siguiente`](../ejemplo02/README.md)

</div>
