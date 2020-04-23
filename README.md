* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)


## About The Project

[![Product Name Screen Shot][product-screenshot]](preview.png)

En este proyecto se implementa una API REST con Node.js, su microframework Express y para el soporte de la información utilizamos la base de datos relacional MySQL.

### Built With

* [Parcel](https://parceljs.org/)
* [Node.js](https://nodejs.org/en/)
* [Bootstrap](https://getbootstrap.com)


## Getting Started

Para utilizar el proyect se deberá contar al menos con Node.js 13.10.1 y MySQL 8.0.

### Prerequisites
* npm
```sh
npm install npm@latest -g
```

### Installation
1. Clona el repositorio
```sh
git clone https://github.com/me-chell/delilahresto.git
```
2. Instalá las dependencias con NPM
```sh
npm install
```
3. Edita tu línea de conexión a MySQL en `.env`
```JS
SQL_URI='ENTER_YOUR_CONNECTION_CREDENTIALS'
```

4. Crea la base de datos con los queries del archivo /db.sql, el mismo cuenta con la pre-carga de los productos observables en los mock-ups del proyecto (incluídos en /docs/mocks), con los estados de pedido, formas de pago y un usuario "admin@admin" y otro "user@user", con privilegios de admin y cliente respectivamente.

5. Ejecuta el servidor
```sh
npm run dev
```


## Usage
En el directorio principal encontraran un spec.yaml y un postman.json para testear las rutas.
También se puede acceder a http://localhost:3000 y http://localhost:3000/admin para probar las rutas con una interface semejante a los mock-ups enviados -BETA-.


## Contact

Juan Chemello - [@mechell_dev](https://twitter.com/mechell_dev) - juanchemell@gmail.com

Project Link: [https://github.com/me-chell/delilahresto.git](https://github.com/me-chell/delilahresto.git)