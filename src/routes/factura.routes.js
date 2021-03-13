'use strict'

//IMPORTACIONES
const express = require("express")
const facturaControlador = require("../controllers/factura.controller");

// MIDDLEWARE
var md_autenticacion = require("../middlewares/authenticated")

//RUTAS
var api = express.Router();

api.put('/comprar', md_autenticacion.ensureAuth, facturaControlador.comprar);
api.get('/todasLasFacturas', md_autenticacion.ensureAuthM, facturaControlador.todasLasFacturas);


module.exports = api;