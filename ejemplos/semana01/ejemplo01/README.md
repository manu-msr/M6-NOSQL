[`Conceptos avanzados de bases de datos NoSQL`](../../../README.md) > [`Semana 01`](../README.md) > `Ejemplo 01`

## Ejemplo 01: Recorrer y preparar el entorno de trabajo

<div style="text-align: justify;">

### 1. Objetivos :dart:

- Reconocer los espacios de trabajo disponibles en AWS Academy.
- Distinguir la terminal Bash de la consola de MongoDB.
- Observar la configuración inicial de MongoDB dentro del Learner Lab.
- Comprobar la base de datos, sus colecciones y un documento de ejemplo.

### 2. Requisitos :clipboard:

1. Haber revisado la Nota 01.
2. Seguir la demostración realizada por el docente.
3. Tener a la mano el
   [manual de configuración](../../../docs/inicio_learner_lab.md) para
   consultarlo cuando se prepare la instancia individual.

> En este ejemplo el docente realizará los comandos. No necesitas configurar
> todavía tu instancia ni copiar cada instrucción durante la demostración.

### 3. Desarrollo :rocket:

#### Paso 1. Reconocer los espacios de trabajo

El docente mostrará la diferencia entre el aula de AWS Academy, donde se
consultan materiales y entregas, y el Learner Lab, donde se encuentra la
terminal utilizada para ejecutar los recursos técnicos del módulo.

También señalará el indicador de Bash. Éste suele terminar con el símbolo `$` y
acepta comandos para desplazarse entre directorios, clonar el repositorio y
ejecutar scripts.

#### Paso 2. Obtener el repositorio

Desde la terminal integrada, el docente mostrará la primera entrada al
repositorio:

```bash
cd ~
git clone https://github.com/manu-msr/M6-NOSQL.git m6-nosql
cd m6-nosql
pwd
ls
```

`pwd` permite comprobar la ubicación actual. La ruta debe terminar en
`/m6-nosql`; con `ls` deben aparecer las carpetas `datos`,
`ejemplos`, `retos` y `setup`.

#### Paso 3. Configurar MongoDB

La configuración se inicia desde la raíz del repositorio:

```bash
bash setup/setup.sh
```

El script instala las herramientas dentro del clon, inicia MongoDB en la misma
instancia del Learner Lab y carga la base `m6_nosql`. La preparación termina
correctamente cuando aparece:

```text
Preparación completa. MongoDB está activo y la base m6_nosql está poblada.
```

#### Paso 4. Entrar a la consola de MongoDB

El docente abrirá la consola con:

```bash
bash setup/conectar.sh
```

El indicador cambiará a `m6_nosql>` o, en la consola clásica, a `>`. Esto
permite reconocer que las siguientes instrucciones pertenecen a MongoDB y no a
Bash:

```javascript
db.getName()
db.runCommand({ ping: 1 })
show collections
db.polizas.countDocuments({})
db.siniestros.countDocuments({})
db.polizas.findOne({ _id: "POL-1001" })
```

La demostración permite reconocer la base activa, confirmar la conexión,
enumerar las colecciones e inspeccionar un documento con campos simples, un
documento anidado y un arreglo. Para regresar a Bash se utiliza `exit`.

#### Paso 5. Ejecutar el recorrido completo

El ejemplo también puede reproducirse con un solo comando desde Bash:

```bash
bash ejemplos/semana01/ejemplo01/scripts/ejecutar.sh
```

La salida debe confirmar cuatro colecciones base, seis pólizas y diez
siniestros, y mostrar la estructura de `POL-1001`.

#### Interpretación

La terminal Bash administra el entorno y ejecuta archivos; la consola de
MongoDB permite consultar la base. El instalador usa `mongosh` en imágenes
modernas y la consola clásica `mongo` en Ubuntu 16.04. La base se ejecuta dentro
de la instancia individual del Learner Lab y utiliza datos sintéticos. Esta
configuración es didáctica y no representa una instalación de producción.

#### Relación con el Reto 01

En el reto repetirás la configuración en tu propia instancia, comprobarás que
la base responda y completarás una consulta breve. El objetivo será demostrar
que tu espacio de trabajo quedó listo para las siguientes sesiones.

<br/>

[`Semana 01`](../README.md) | [`Siguiente`](../ejemplo02/README.md)

</div>
