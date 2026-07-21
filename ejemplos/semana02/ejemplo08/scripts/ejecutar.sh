#!/usr/bin/env bash
set -eu

ROOT_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")/../../../.." && pwd)
# shellcheck disable=SC1091
. "$ROOT_DIR/setup/lib/mongodb_local.sh"

mongodb_iniciar
echo "Ejecutando las pruebas del Ejemplo 08..."
mongodb_ejecutar_archivo \
  "$ROOT_DIR/ejemplos/semana02/ejemplo08/consultas/validar_arreglos_anidados.js"
