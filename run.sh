#!/bin/bash
# Inicio rápido de proyecto odoo

PROJECT_NAME=$1
ODOO_VERSION=$2
PORT=$3

# Project's name
git clone https://github.com/FredyChivalan/odoo-docker-compose $PROJECT_NAME
rm -rf $PROJECT_NAME/.git
rm -rf $PROJECT_NAME/install_docker

# Permissions
chmod 777 $PROJECT_NAME/odoo/addons

# config
sed -i 's/proyecto_odoo/'$PROJECT_NAME'/g' $PROJECT_NAME/.env
sed -i 's/14.0/'$ODOO_VERSION'/g' $PROJECT_NAME/.env
sed -i 's/8075/'$PORT'/g' $PROJECT_NAME/.env

# Running odoo
docker-compose -f $PROJECT_NAME/docker-compose.yaml up -d
