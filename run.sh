#!/bin/bash
# Inicio rápido de proyecto odoo

PROJECT_NAME=$1
ODOO_VERSION=$2
PORT=$3

# Project's name
git clone https://github.com/FredyChivalan/odoo-docker-compose $PROJECT_NAME
cd $PROJECT_NAME
rm -rf .git
rm -rf resources

# config
sed -i 's/proyecto_odoo/'$PROJECT_NAME'/g' .env
sed -i 's/14.0/'$ODOO_VERSION'/g' .env
sed -i 's/8068/'$PORT'/g' .env

# Running odoo
docker-compose up -d
