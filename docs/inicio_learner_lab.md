# Inicio del trabajo técnico en AWS Academy Learner Lab

Todo el trabajo técnico del módulo se realiza en la terminal integrada del
Laboratorio de aprendizaje de AWS Academy. No utilices la terminal de tu
computadora personal para instalar herramientas, conectarte a la base ni
ejecutar los ejemplos.

## 1. Iniciar el laboratorio

1. Entra al módulo correspondiente dentro de AWS Academy.
2. Abre **Laboratorio de aprendizaje de AWS Academy**.
3. Selecciona **Start Lab**.
4. Espera a que el laboratorio indique que está disponible y a que la terminal
   integrada acepte comandos.

La interfaz también puede mostrar opciones como **End Lab**, **AWS Details**,
**Readme** y **Reset**. No uses **Reset** salvo indicación expresa del docente.

## 2. Clonar el repositorio dentro del laboratorio

Clonar significa crear dentro del Learner Lab una copia de los archivos del
curso. No modifica el repositorio original y no instala nada en tu computadora.

La dirección completa del repositorio del curso es:

https://github.com/manu-msr/M6-NOSQL

Selecciona el área de la terminal integrada y copia estas instrucciones **una
línea a la vez**. Presiona `Enter` después de cada línea:

```bash
cd ~
git clone https://github.com/manu-msr/M6-NOSQL.git m6-nosql
cd m6-nosql
pwd
ls
```

| Comando | Qué hace | Qué debes comprobar |
|---|---|---|
| `cd ~` | Te coloca en tu directorio de trabajo dentro del laboratorio. | No aparece un mensaje de error. |
| `git clone https://github.com/manu-msr/M6-NOSQL.git m6-nosql` | Copia los archivos y llama `m6-nosql` a la nueva carpeta. | Aparece un mensaje semejante a `Cloning into 'm6-nosql'`. |
| `cd m6-nosql` | Entra a la carpeta técnica del curso. | No aparece un mensaje de error. |
| `pwd` | Muestra la carpeta en la que estás. | La ruta termina en `/m6-nosql`. |
| `ls` | Muestra los archivos y carpetas disponibles. | Aparecen `README.md`, `datos`, `ejemplos`, `retos` y `setup`. |

El repositorio es público, por lo que `git clone` no debe solicitar usuario ni
contraseña. Si los solicita, detente y comunica el mensaje al docente.

Si aparece `git: command not found`, no continúes desde una computadora
personal ni intentes modificar el sistema del laboratorio. Copia el mensaje
completo y comunícalo al docente para verificar la imagen del Learner Lab.

Si aparece `Repository not found` o un mensaje de acceso denegado, vuelve al
inicio de este apartado y copia nuevamente el comando completo de `git clone`.
Si el error persiste, comunica el mensaje al docente; no introduzcas tu
contraseña de AWS en la terminal.

### Si aparece `remote HEAD refers to nonexistent ref`

Ese aviso indica que Git descargó los archivos internos del repositorio, pero
no seleccionó automáticamente la rama de trabajo. No repitas `git clone`,
porque la carpeta `m6-nosql` ya fue creada. Recupérala con:

```bash
cd ~/m6-nosql
git fetch origin
git checkout -b main origin/main
pwd
ls
```

Al final, `pwd` debe terminar en `/m6-nosql` y `ls` debe mostrar `README.md`,
`datos`, `ejemplos`, `retos` y `setup`.

### Si aparece `destination path 'm6-nosql' already exists`

Ese mensaje significa que ya existe una copia. Si el primer intento también
mostró `remote HEAD refers to nonexistent ref`, utiliza la recuperación del
apartado anterior. En cualquier otro caso, no vuelvas a clonar y ejecuta:

```bash
cd ~/m6-nosql
git pull --ff-only
pwd
```

`git pull --ff-only` actualiza tu copia con los cambios publicados. Al final,
`pwd` debe mostrar una ruta terminada en `/m6-nosql`.

## 3. Regresar al repositorio en una sesión posterior

Después de iniciar nuevamente el Learner Lab, ejecuta una línea a la vez:

```bash
cd ~/m6-nosql
git pull --ff-only
pwd
ls
```

Si la primera línea muestra `No such file or directory`, la copia no está
disponible y debes repetir el apartado 2. La disponibilidad de archivos entre
sesiones depende de la configuración efectiva del laboratorio.

## 4. Instalar MongoDB y preparar la base

Ejecuta `pwd` y comprueba que la ruta termine en
`/m6-nosql`. Desde esa carpeta, copia el siguiente comando y
presiona `Enter`:

```bash
bash setup/setup.sh
```

Durante la primera ejecución, el proceso puede tardar algunos minutos porque
realiza estas acciones:

1. comprueba que la imagen Linux y el procesador sean compatibles;
2. descarga MongoDB Community 7.0.24 y `mongosh` desde sus sitios oficiales;
3. guarda los programas en `.tools/bin` dentro del clon;
4. inicia el servidor `mongod` en `127.0.0.1:27017`;
5. carga las colecciones de trabajo en la base `m6_nosql`;
6. verifica 6 pólizas, 15 coberturas separadas y 10 siniestros.

No cierres la terminal mientras se muestran los pasos `1/4` a `4/4`. La
preparación terminó correctamente cuando aparecen estas líneas:


```text
Verificación correcta: 6 pólizas, 15 coberturas separadas y 10 siniestros.
Preparación completa. MongoDB está activo y la base m6_nosql está poblada.
Para abrir la consola ejecuta:
bash setup/conectar.sh
```

El script no utiliza `sudo`, no modifica directorios del sistema y no instala
nada en tu computadora personal. Si vuelves a ejecutarlo, reutiliza los
programas descargados, confirma que el servidor esté activo y restablece las
colecciones base.

## 5. Abrir la consola y comprobar la conexión

Desde `~/m6-nosql`, ejecuta:

```bash
bash setup/conectar.sh
```

El script confirma que `mongod` está activo y abre `mongosh` directamente en la
base de trabajo. La conexión fue correcta cuando el indicador de la consola
termina en:

```text
m6_nosql>
```

Escribe cada instrucción y presiona `Enter`:

```javascript
db.getName()
db.runCommand({ ping: 1 })
show collections
```

Comprueba estos resultados:

- `db.getName()` devuelve `m6_nosql`;
- el resultado de `ping` contiene `ok: 1`;
- `show collections` incluye `polizas`, `polizas_referencias`,
  `coberturas_poliza` y `siniestros`.

Para cerrar `mongosh` y regresar a la terminal Bash, escribe:

```javascript
exit
```

El cambio del indicador permite distinguir las dos consolas:

- un indicador semejante a `usuario@equipo:~$` corresponde a Bash y acepta
  comandos como `cd`, `git` y `bash`;
- `m6_nosql>` corresponde a `mongosh` y acepta consultas MongoDB como
  `db.polizas.findOne()`.

## 6. Alcance de esta conexión

La instancia sólo escucha en `127.0.0.1`, una dirección accesible desde la
misma terminal del Learner Lab. No se conecta con Amazon DocumentDB ni expone
el puerto a Internet. Los datos son sintéticos y la instancia didáctica no usa
autenticación; esta configuración no debe copiarse en un sistema de producción.

Si falla la instalación o la conexión, consulta
[`setup/verificaciones.md`](../setup/verificaciones.md).

Al terminar, sigue el procedimiento indicado por el docente para cerrar la
sesión del laboratorio.
