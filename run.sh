#!/bin/bash
# Initial configuration of "Odoo" project

while true; do
  read -p "Nombre del proyecto [quickstart]: " PROJECT

  if [ "$PROJECT" != "" ]; then
    git clone https://gitlab.com/sre_resource/docker/odoo-docker-compose.git $PROJECT
    cd $PROJECT
    echo "PROJECT=$PROJECT" >> .env
    break
  fi
done

PS3="Seleccione de 1, 2, 3, 4, 5, 6, 7, 8, 9 [1]: "
echo "Seleccione versión de Odoo:"
select version in latest 16 16.0 15 15.0 14 14.0 13 13.0; do
  if [ "$version" != "" ]; then
    echo "ODOO_VERSION=$version" >> .env
    sed -i 's/latest/'$version'/g' odoo/resources/Dockerfile
    break
  else
    echo "Selección incorrecta "
  fi
done

PORT=$(shuf -i 0-99 -n1)
echo PORT=80$PORT >> .env

# Database credentials
# --------------------
PASS=$(openssl rand -base64 32)
echo DB_PASSWORD=$PASS >>.env

echo "admin_passwd = $PASS" >> ./odoo/config/odoo.conf

printf "\nConfigurando...\n"

rm -rf .git
rm -rf resources

# Run docker comose
docker-compose up -d

printf "
NOMBRE: $PROJECT
ESTADO: Implementado
NOTAS:
**Puede tardar unos minutos, tenga paciencia mientras se implementa**

1. Pude acceder a $PROJECT a travéz de
   http://localhost:80$PORT o http://host-ip:80$PORT

2. Obtenga la contraseña ejecutando el comando:
   cat $PROJECT/.env | grep DB_PASSWORD
"
