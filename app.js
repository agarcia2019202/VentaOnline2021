'use  strict'

//VARIABLES GLOBALES
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const usuario_rutas = require("./src/routes/usuario.routes");
const categoria_rutas = require("./src/routes/categoria.routes");
const producto_rutas = require("./src/routes/producto.routes");
const carrito_rutas = require("./src/routes/carrito.routes");
const factura_rutas = require("./src/routes/factura.routes");

//MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//CABECERAS
app.use(cors());

app.use('/api', usuario_rutas, categoria_rutas, producto_rutas, carrito_rutas, factura_rutas);

//EXPORTAR
module.exports = app;