# Instalando Odoo con docker

<img src="screenshots/odoo-docker.png" alt="odoo" width="200"/>


Una solución flexible y rápida para implementar multiples instancias de `Odoo` en un servidor. Algunas razónes por las que usted podría usar esta guía.
- Versiones soportados de **Odoo** (`12`, `12.0`, `13`, `13.0`, `14`, `14.0`, `latest`)
- Versiones soportados de PostgreSQL(`10`, `11`, `12`, `13`, `alpine`, `latest`)
- Versión personalizable de PostgreSQL.
- Configuración optimizada para entorno de desarrollo y producción.


## Requerimientos
- Docker
- Docker Compose

## Iniciar una instancia
1. Instale docker y docker-compose en su servidor. (Omita este paso si tiene docker instalado).
```bash
# ubuntu
curl - https://raw.githubusercontent.com/FredyChivalan/odoo-docker-compose/main/install_docker/install_docker_on_ubuntu.sh | bash
```

2. Supongamos que desea crear un proyecto de `odoo` llamado "simple-odoo". Ejecute este comando. (Sí dedea crear otro proyecto, no olvide cambiar los argumentos).
```bash
curl -s https://raw.githubusercontent.com/FredyChivalan/odoo-docker-compose/main/run.sh | bash -s simple-odoo 14.0 8070
```
Algunos argumentos:
- Primer argumento (**simple-odoo**): nombre del proyecto.
- Segundo argumento (**14.0**): Versión de Odoo.
- Tercer argumento (**8070**): Puerto.
