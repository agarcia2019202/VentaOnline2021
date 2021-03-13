'use strict'

//IMPORTACIONES
const express = require("express")
const categoriaControlador = require("../controllers/categoria.controller");

// MIDDLEWARE
var md_autenticacion = require("../middlewares/authenticated")

//RUTAS
var api = express.Router();

api.post('/agregarCategoria', md_autenticacion.ensureAuthM, categoriaControlador.agregarCategoria);
api.put('/editarCategoria/:idCategoria', md_autenticacion.ensureAuthM, categoriaControlador.editarCategoria);
api.get('/listarCategorias', md_autenticacion.ensureAuth, categoriaControlador.listarCategorias);
api.delete('/eliminarCategoria/:idCategoria', md_autenticacion.ensureAuthM, categoriaControlador.eliminarCategoria);


module.exports = api;