#!/usr/bin/env bash
set -eu

ROOT_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")/../../../.." && pwd)
# shellcheck disable=SC1091
. "$ROOT_DIR/setup/lib/mongodb_local.sh"

mongodb_iniciar
echo "Preparando la colección del Reto 04..."
mongodb_ejecutar_archivo \
  "$ROOT_DIR/retos/semana02/reto04/datos/cargar_datos_reto04.js"
echo "Colección del Reto 04 disponible en la base m6_nosql."
