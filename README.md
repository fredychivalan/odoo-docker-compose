# Instalando Odoo con docker

<img src="screenshots/odoo-docker.png" alt="odoo" width="200"/>


Una solución flexible y rápida para implementar multiples instancias de `Odoo` en un servidor. Algunas razónes por las que usted podría usar esta guía.
- Versiones soportados de **Odoo** (`12`, `12.0`, `13`, `13.0`, `14`, `14.0`, `latest`)
- Versiones soportados de PostgreSQL(`10`, `11`, `12`, `13`, `alpine`, `latest`)
- Versión personalizable de [**Odoo**][odoo].
- Versión personalizable de [**PostgreSQL**][postgres].
- Configuración optimizada para entorno de desarrollo y producción.


## Requerimientos
- [Docker][docker]
- [Docker Compose][docker-compose]


# Cómo implementar
## Iniciar una instancia
1. Instale docker y docker-compose en su servidor. (Omita este paso si tiene docker instalado).
```bash
# ubuntu
curl -s https://raw.githubusercontent.com/FredyChivalan/odoo-docker-compose/main/install_docker/install_docker_on_ubuntu.sh | bash
```

2. Supongamos que desea crear un proyecto de `odoo` llamado "**simple-odoo**".
```bash
curl -s https://raw.githubusercontent.com/FredyChivalan/odoo-docker-compose/main/run.sh | bash -s simple-odoo 14.0 8070
```
Al final de la línea de comando, encontrará argumentos predeterminados:
  - Primer argumento (**simple-odoo**): nombre del proyecto.
  - Segundo argumento (**14.0**): Versión de Odoo.
  - Tercer argumento (**8070**): Puerto.


3. Espere a que se inicialice completamente, y visita `http://localhost:8070` o `http://host-ip:8070` (según corresponda).

<img src="screenshots/Odoo.png" alt="odoo" width="1200"/>

## Detener y reiniciar una instancia de Odoo
Reinicie Odoo:
```bash
docker-compose restart
```
Detener Odoo:
```bash
docker-compose down
```


### Escribiendo...


[docker]: https://docs.docker.com/engine/install/ "Docker"
[docker-compose]: https://docs.docker.com/compose/install/ "Docker Compose"
[odoo]: https://hub.docker.com/_/odoo/ "Odoo"
[postgres]: https://hub.docker.com/_/postgres/ "Postgres"
