# Instalando Odoo con docker
<p align="center">
  <img src="resources/screenshot/odoo-docker.png" alt="odoo" width="200"/>
  <br><br>
	<img src="https://img.shields.io/badge/version-1.1.2-green.svg?style=for-the-badge">
  <a href="https://www.digitalocean.com/?refcode=9f8258252636&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge">
  <img src="https://img.shields.io/badge/Digital Ocean-$100-green.svg?style=for-the-badge">
  </a>

</p>


Una solución flexible y rápida para implementar multiples instancias de `Odoo` en un servidor. Algunas razónes por las que usted podría usar esta guía.
- Versiones soportados de [**Odoo**][odoo] (`12.0`, `12`, `13.0`, `13`, `14.0`, `14`, `latest`).
- Versiones soportados de [**PostgreSQL**][postgres](`10`, `11`, `12`, `13`, `alpine`, `latest`).
- Configuración optimizada para entorno de desarrollo y producción.
- Integración con **Nginx Proxy Manager**.

## Artítulos relacionados
- [Docker Official Images][odoo]
- [Nginx Proxy Manager][proxy]
- [Implementar Nginx Proxy Manager][FredyChivalan]

## Requerimientos
- [Docker][docker]
- [Docker Compose][docker-compose]


# Cómo implementar
## Iniciar una instancia
1. Instale docker y docker-compose en su servidor. (Omita este paso si tiene docker instalado).

    **Ubuntu**
    ```bash
    curl -s https://raw.githubusercontent.com/FredyChivalan/odoo-docker-compose/main/resources/install_docker/ubuntu.sh | bash
    ```
    **Debian**
    ```bash
    curl -s https://raw.githubusercontent.com/FredyChivalan/odoo-docker-compose/main/resources/install_docker/debian.sh | bash
    ```

2. Supongamos que desea crear un proyecto de `odoo` llamado "**simple-odoo**".

    ```bash
    curl -s https://raw.githubusercontent.com/FredyChivalan/odoo-docker-compose/main/run.sh | bash -s simple-odoo 14.0 8070
    ```

    Al final de la línea de comando, encontrará argumentos predeterminados:
      - Primer argumento (**simple-odoo**): nombre del proyecto.
      - Segundo argumento (**14.0**): Versión de Odoo.
      - Tercer argumento (**8070**): Puerto a exponer.


3. Espere a que se inicialice completamente, y visita `http://localhost:8070` o `http://host-ip:8070` (según corresponda).

    <img src="resources/screenshot/odoo.png" alt="odoo" width="100%"/>


## Detener y reiniciar una instancia de Odoo
Ejecute estas instrucciones en un proyecto de **Odoo**.

**Iniciar**
```bash
docker-compose up -d
```
**Reiniciar**
```bash
docker-compose restart
```
**Detener**
```bash
docker-compose down
```

## Ejecutar varias instancias de Odoo

**Restaurante**
```bash
curl -s https://raw.githubusercontent.com/FredyChivalan/odoo-docker-compose/main/run.sh | bash -s restaurante 12.0 8071
```
**Cafetería**
```bash
curl -s https://raw.githubusercontent.com/FredyChivalan/odoo-docker-compose/main/run.sh | bash -s cafeteria 13.0 8072
```
Tenga en cuenta exponer nombres y puertos diferentes para cada proyecto (por ejemplo, restaurante expone el puerto 8071 y cafeteria expone el puerto 8072).


# Nginx Proxy Manager

1. Ejecute la aplicación con Docker Compose, como se muestra a continuación:
    ```bash
    curl -s https://gitlab.com/fredy_chivalan/docker-nginx-proxy-manager/-/raw/main/run.sh | bash -s 85
    ```
    Al final de la línea de comando, encontrará argumento predeterminado:

      - `85`: Puerto necesario para panel de administración de `hosts`.


2. Espere a que se inicialice completamente, y visita `http://localhost:85` o `http://host-ip:85` (según corresponda).

    <img src="resources/screenshot/nginx_proxy.png" alt="odoo" width="100%"/>


3. Inicie sesión en la interfaz de usuario de Admin

    De Usuario De Administrador Predeterminada:
    ```console
    Email:    admin@example.com
    Password: changeme
    ```

    Inmediatamente después de iniciar sesión con este usuario predeterminado, se le pedirá que modifique sus datos y cambie su contraseña.

# Cómo extender esta guía
Esta guía está inspirada para sistema operativo GNU/Linux.
Sin tratar de apoyar a cada posible caso de uso, aquí son sólo algunas que hemos encontrado útiles.

## Entorno de desarrollo

1. `Permisos`: Odoo necesita permisos de lectura y escritura para poder crear un módulo, acceda a su proyecto y ejecute este comando.
    ```bash
    chmod 777 odoo/addons
    ```
2. `Addon`: Crea un nuevo módulo ejecutando el comando que se muestra a continuación.
    ```bash
    docker exec -d odoo-$PROJECT_NAME /usr/bin/odoo scaffold $ADDON /mnt/extra-addons
    ```
    Remplace los argumentos:
    - `$PROJECT_NAME`: Nombre del proyecto que declaró al momento de iniciar una instancia de odoo.
    - `$ADDON`: Nombre que recibirá el nuevo módulo.

    El finalizar la ejecución del comando, se creará una estructra similar a ésta.
    ```bash
    ├── controllers
    │   ├── controllers.py
    │   └── __init__.py
    ├── demo
    │   └── demo.xml
    ├── __init__.py
    ├── __manifest__.py
    ├── models
    │   ├── __init__.py
    │   └── models.py
    ├── security
    │   └── ir.model.access.csv
    └── views
        ├── templates.xml
        └── views.xml
    ```

3. `$USER`: Cambia el propietario de addon recién creado, sino cambia el propietario no podrá editar el código fuente fuera del contenedor.
    ```bash
    sudo chown -R $USER:$USER odoo/addons/$ADDON
    ```
    Remplace el argumento `$ADDON`, por el nombre del módulo recien creado.


4. `Restart`: Para que el nuevo módulo se pueda instalar desde el panel de administración del proycto `Odoo` debe de reiniciar el servicio.
    ```bash
    docker-compose restart
    ```


## Variables de entorno
Ajustar estas variables de entorno para conectar fácilmente a un gestor de base de datos **PostgreSQL** con su proyecto [`Odoo`][odoo]. Las variable de entorno están alojados en el archivo `.env`

### Odoo

- `PROJECT_NAME`: Esta opcional variable de entorno se utiliza para definir un nombre diferente para los proyectos de `Odoo`. No debe estar vacío.

- `ODOO_VERSION`: Esta variables de entorno es necesaria para utilizar [`Odoo`][odoo]. No debe estar vacio. En esta variable de entorno se establece la version soportado y mantenida por [**Odoo**][odoo].

- `PORT`: Esta opcional variable de entorno es necesaria para utilizar [`Odoo`][odoo]. No debe estár vacio. Se implementa para exponer el puerto que escuchará el contenedor del proyecto **Odoo**.

### Postgres

- `POSTGRES_VERSION`: Esta variables de entorno es necesaria para utilizar PostgreSQL. No debe estar vacio. En esta variable de entorno se establece la version soportado y mantenida por [Postgres][postgres].([Consulte aquí][postgres]), Por defecto utiliza la version `alpine`.

- `POSTGRES_USER`: Este opcional variable de entorno se utiliza en conjunción con `POSTGRES_PASSWORD` configurar un usuario y su contraseña. Esta variable va a crear el usuario especificado con permisos de superusuario y una base de datos con el mismo nombre. Si no se especifica, el valor predeterminado de usuario de `postgres` va a ser utilizado.

- `POSTGRES_DB`: Este opcional variable de entorno se pueden utilizar para definir un nombre diferente para la base de datos por defecto que se crea cuando la imagen se inicia por primera vez. Si no es especificado, entonces el valor de `POSTGRES_USER` va a ser utilizado.

- `POSTGRES_PASSWORD`: Esta variable de entorno es necesaria para utilizar PostgreSQL. No debe estar vacío o indefinido. Esta variable de entorno se establece la contraseña de superusuario para PostgreSQL. El valor predeterminado de superusuario se define por la `POSTGRES_USER` la variable de entorno.


## Dónde se almacenan los Datos

**Nota importante:** Hay varias maneras de guardar los datos usados por las aplicaciones que se ejecutan en contenedores docker. Animamos a los usuarios de las a familiarizarse con las [`opciones disponibles`][volumes].


## Digital Ocean
  Obten `$ 100.00` de crédito al crear tu cuenta por primera vez en `Digital Ocean` usando el enlace que se muestra a continuación.

  <a href="https://www.digitalocean.com/?refcode=9f8258252636&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge"><img src="https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg" alt="DigitalOcean Referral Badge" /></a>

[docker]: https://docs.docker.com/engine/install/ "Docker"
[docker-compose]: https://docs.docker.com/compose/install/ "Docker Compose"
[odoo]: https://hub.docker.com/_/odoo/ "Odoo"
[postgres]: https://hub.docker.com/_/postgres/ "Postgres"
[volumes]: https://docs.docker.com/storage/volumes/ "Volumes"
[proxy]: https://nginxproxymanager.com/guide/#project-goal "Nginx Proxy Manager"
[FredyChivalan]: https://gitlab.com/fredy_chivalan/docker-nginx-proxy-manager "Configuración de Nginx"
