#!/usr/bin/env bash
set -eu

ROOT_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")/../../../.." && pwd)
# shellcheck disable=SC1091
. "$ROOT_DIR/setup/lib/mongodb_local.sh"

mongodb_iniciar
echo "Cargando los datos del Reto 08..."
mongodb_ejecutar_archivo \
  "$ROOT_DIR/retos/semana04/reto08/datos/cargar_datos_reto08.js"
echo "Datos del Reto 08 disponibles en la base m6_nosql."
