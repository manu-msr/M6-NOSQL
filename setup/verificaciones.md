# Verificaciones del entorno

## Lista de comprobación

- [ ] El Learner Lab se encuentra iniciado.
- [ ] La terminal usada es la terminal integrada del Learner Lab, no una
      terminal personal.
- [ ] El repositorio se clonó dentro del laboratorio y la terminal se encuentra
      en la raíz de `repositorio`.
- [ ] `bash setup/setup.sh` informa que MongoDB está activo en
      `127.0.0.1:27017`.
- [ ] La carga termina con 6 pólizas, 15 coberturas separadas y 10 siniestros.
- [ ] El último mensaje informa `Preparación completa`.
- [ ] `bash setup/conectar.sh` abre un indicador terminado en `m6_nosql>`.
- [ ] `db.runCommand({ ping: 1 })` devuelve un resultado con `ok: 1`.

## Interpretación de errores frecuentes

### La imagen no es compatible

El instalador muestra el sistema y la arquitectura detectados. Copia el mensaje
completo y comunícalo al docente. No uses `sudo`, no instales otra versión por
tu cuenta y no traslades la actividad a una computadora personal.

### El procesador no informa AVX

MongoDB 7.0 requiere AVX en equipos `x86_64`. Copia el mensaje completo y
comunícalo al docente; esta condición depende de la imagen del Learner Lab.

### Falla la descarga o la suma SHA-256

Confirma que el laboratorio siga activo y vuelve a ejecutar desde la raíz:

```bash
bash setup/setup.sh
```

El script verifica la integridad del paquete antes de instalarlo. Si el mismo
error se repite, copia el mensaje completo y comunícalo al docente.

### `No se encontró un archivo necesario`

Comprueba que `pwd` termine en `/m6-nosql/repositorio` y que `ls` muestre
`datos`, `ejemplos`, `retos` y `setup`. Si la copia ya existía, actualízala:

```bash
cd ~/m6-nosql
git pull --ff-only
cd repositorio
bash setup/setup.sh
```

### MongoDB no responde después de 30 segundos

Muestra las últimas líneas del registro con:

```bash
tail -n 30 .runtime/mongodb/mongod.log
```

Copia esa salida y comunícala al docente. No abras el puerto ni cambies
`127.0.0.1`.

### `MongoNetworkError: connect ECONNREFUSED`

La consola no encontró un servidor activo. Regresa a Bash si el indicador
termina en `m6_nosql>` escribiendo `exit`. Después ejecuta:

```bash
bash setup/setup.sh
bash setup/conectar.sh
```

### Las cantidades no coinciden

Ejecuta nuevamente `bash setup/setup.sh`. La carga elimina y vuelve a crear
únicamente las colecciones base utilizadas por los ejemplos 01 a 04.
