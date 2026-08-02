#!/usr/bin/env bash
set -eu

ROOT_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")/../../../.." && pwd)
# shellcheck disable=SC1091
. "$ROOT_DIR/setup/lib/mongodb_local.sh"

mongodb_iniciar
echo "Cargando los datos del Reto 07..."
mongodb_ejecutar_archivo \
  "$ROOT_DIR/retos/semana04/reto07/datos/cargar_datos_reto07.js"
echo "Datos del Reto 07 disponibles en la base m6_nosql."
