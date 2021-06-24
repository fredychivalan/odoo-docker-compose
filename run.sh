#!/bin/bash
# Quick installation of odoo using docker containers.

PROJECT_NAME=$1
ODOO_VERSION=$2
PORT=$3

# Project's name
git clone https://github.com/FredyChivalan/odoo-docker-compose $PROJECT_NAME
rm -rf $PROJECT_NAME/.git
rm -rf $PROJECT_NAME/install_docker

# config
sed -i 's/ecommerce/'$PROJECT_NAME'/g' $PROJECT_NAME/.env
sed -i 's/14.0/'$ODOO_VERSION'/g' $PROJECT_NAME/.env
sed -i 's/8075/'$PORT'/g' $PROJECT_NAME/.env

# Running odoo
docker-compose -f $PROJECT_NAME/docker-compose.yml up -d
