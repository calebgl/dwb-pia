# **DWB - PIA**

El objetivo de este proyecto es simular el backend dedicado para un restaurante de comida rápida. De manera que permita añadir, visualizar, modificar y borrar platillos, ordenes y empleados del restaurante, usando diferentes métodos de seguridad como **JWT Token** y **CORS**. también incluye una pequeña interfaz que funciona como fronted hecha con ayuda de **Swagger**, que permite visualizar los elementos de una mejor manera.

## **Integrantes**

| Matrícula | Nombre                           |
| --------- | -------------------------------- |
| 1844214   | Mario Eduardo Lara Loredo        |
| 1841414   | José Eduardo González Barbosa    |
| 1811684   | Yaziel Gómez Torres              |
| 1859404   | Miguel Eduardo Barragán Elizondo |
| 1855819   | José Francisco Góngora Rangel    |
| 1858846   | Sebastian Ibarra Rodríguez       |
| 1871138   | Alexis Darien Zúñiga Vera        |
| 1845935   | Angel Caleb Guerrero Luna        |

## **Proceso de instalación**

### Base de datos

1. Instalar [PostgreSQL y PgAdmin 4](https://www.postgresql.org/download/).
1. Generar una conexión local (recordar el usuario y contraseña).
1. Crear una base de datos (recordar el nombre)
1. Ejecutar el script ubicado en `dwb-pia/database.sql` en la respectiva base de datos.

### Backend

1. Instalar la última versión LTS de [NodeJS](https://nodejs.org/es/).
1. Instalar globalmente Yarn. En la consola se ejecuta el siguiente comando: `npm install -g yarn`.

1. El archivo ubicado em `dwb-pia/.env.sample` se renombra a `.env`. Este contrendrá el _connection string_ el cual hay que editar acorde a la información de tu base de datos. Establezca el `HASH_LENGTH=72` para un correcto funcionanmiento.

1. Dentro de la carpeta del proyecto ejecutamos en la consola `yarn install`.
1. Dentro de la carpeta del proyecto ejecutamos en la consola `yarn start`.

1. En el navegador visitar la ruta http://localhost:3000.

## Extra

Hicimos el deploy en https://dwb-pia-database.herokuapp.com

<br/>

> **Nota**: Las colecciones del postman se encuentran dentro del repositorio. Asimismo, la documentación de cada endpoint con su respectiva imagen de postman.
