# Preparación del entorno

El Ejemplo 01 muestra, mediante una demostración docente, cómo preparar MongoDB
Community 7.0 dentro del clon. En el Reto 01 cada estudiante repite la
configuración en su propia instancia. La instalación, el servidor, la base y la
consola funcionan en la terminal integrada del Learner Lab. Este directorio no
crea clústeres, redes, usuarios o permisos de AWS.

Repositorio canónico: https://github.com/manu-msr/M6-NOSQL

## Requisitos

- el Learner Lab iniciado y su terminal integrada disponible;
- el repositorio del curso clonado desde esa terminal;
- arquitectura `x86_64` con AVX;
- Ubuntu 20.04 o 22.04, Debian 11 o 12, Amazon Linux 2 o Amazon Linux 2023;
- acceso HTTPS desde el laboratorio a los sitios oficiales de MongoDB.

Consulta primero la
[guía de inicio en Learner Lab](../docs/inicio_learner_lab.md). Incluye los
comandos exactos para crear y verificar la copia del repositorio.

## Ejecución completa

Desde la raíz del repositorio, copia y ejecuta:

```bash
bash setup/setup.sh
```

El script:

1. llama a `instalar_herramientas.sh` para descargar MongoDB Community 7.0.24
   y `mongosh`;
2. guarda los binarios en `.tools/bin`, una ruta excluida de Git;
3. crea los datos y el registro del servidor en `.runtime/mongodb`;
4. inicia `mongod` en `127.0.0.1:27017`;
5. carga y verifica las colecciones sintéticas de `m6_nosql`.

`setup.sh` es repetible. Si los binarios ya existen no vuelve a descargarlos; si
el servidor ya responde, lo reutiliza. La carga sí restablece las colecciones
base para que los ejemplos comiencen desde el mismo estado.

## Conexión desde la misma terminal

Cuando `setup.sh` termine, ejecuta:

```bash
bash setup/conectar.sh
```

El indicador cambia a `m6_nosql>`. Dentro de esa consola, copia estas
instrucciones una por una:

```javascript
db.getName()
db.runCommand({ ping: 1 })
show collections
```

La primera respuesta debe ser `m6_nosql`, el ping debe incluir `ok: 1` y la
lista debe incluir las cuatro colecciones base. Para regresar a Bash, escribe
`exit` y presiona `Enter`.

La instancia escucha únicamente en `127.0.0.1`, contiene datos sintéticos y no
usa autenticación. Es una configuración didáctica local, no una configuración
de producción. Si algún paso falla, consulta
[verificaciones.md](verificaciones.md).
