#!/usr/bin/env bash
set -eu

ROOT_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
# shellcheck disable=SC1091
. "$ROOT_DIR/setup/lib/mongodb_local.sh"

echo "Preparación del entorno desde la terminal integrada de Learner Lab."

echo "1/4 Instalando MongoDB y mongosh dentro del clon..."
bash "$ROOT_DIR/setup/instalar_herramientas.sh"

echo "2/4 Iniciando el servidor MongoDB local..."
mongodb_iniciar

echo "3/4 Cargando la base de trabajo m6_nosql..."
mongodb_ejecutar_archivo "$ROOT_DIR/datos/base/cargar_datos_base.js"

echo "4/4 Verificando la carga..."
mongodb_ejecutar_archivo "$ROOT_DIR/datos/base/verificar_datos_base.js"

echo "Preparación completa. MongoDB está activo y la base m6_nosql está poblada."
echo "Para abrir la consola ejecuta:"
echo "bash setup/conectar.sh"
