#!/usr/bin/env bash
set -eu

ROOT_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")/../../../.." && pwd)
# shellcheck disable=SC1091
. "$ROOT_DIR/setup/lib/mongodb_local.sh"

mongodb_iniciar
echo "1/2 Restableciendo los datos base..."
mongodb_ejecutar_archivo "$ROOT_DIR/datos/base/cargar_datos_base.js"
echo "2/2 Ejecutando el pipeline del Ejemplo 03..."
mongodb_ejecutar_archivo \
  "$ROOT_DIR/ejemplos/semana01/ejemplo03/consultas/filtrar_proyectar_ordenar.js"
