'use strict'

//IMPORTACIONES
const express = require("express")
const carritoControlador = require("../controllers/carrito.controller");

// MIDDLEWARE
var md_autenticacion = require("../middlewares/authenticated")

//RUTAS
var api = express.Router();

api.put('/agregarAlCarrito', md_autenticacion.ensureAuth, carritoControlador.agregarAlCarrito);
api.delete('/eliminarCarrito', md_autenticacion.ensureAuth, carritoControlador.eliminarCarrito);


module.exports = api;