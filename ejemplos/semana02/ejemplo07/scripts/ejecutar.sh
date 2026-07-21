#!/usr/bin/env bash
set -eu

ROOT_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")/../../../.." && pwd)
# shellcheck disable=SC1091
. "$ROOT_DIR/setup/lib/mongodb_local.sh"

mongodb_iniciar
echo "Ejecutando las pruebas del Ejemplo 07..."
mongodb_ejecutar_archivo \
  "$ROOT_DIR/ejemplos/semana02/ejemplo07/consultas/validar_siniestro.js"
