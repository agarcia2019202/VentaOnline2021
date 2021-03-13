'use strict'

//IMPORTACIONES
const express = require("express")
const productoControlador = require("../controllers/producto.controller");

// MIDDLEWARE
var md_autenticacion = require("../middlewares/authenticated")

//RUTAS
var api = express.Router();

api.post('/agregarProducto', md_autenticacion.ensureAuthM, productoControlador.agregarProducto);
api.get('/listarProductos', md_autenticacion.ensureAuth, productoControlador.listarProductos);
api.put('/editarProducto/:idProducto', md_autenticacion.ensureAuthM, productoControlador.editarProducto);
api.delete('/eliminarProducto/:idProducto', md_autenticacion.ensureAuthM, productoControlador.eliminarProducto);
api.post('/buscarProductos', md_autenticacion.ensureAuth, productoControlador.buscarProductosNombre);
api.get('/buscarProductosCategoria/:idCategoria', md_autenticacion.ensureAuth, productoControlador.buscarProductosCategoria);
api.get('/productosMasVendidos', md_autenticacion.ensureAuth, productoControlador.productosMasVendidos);
api.get('/productosAgotados', md_autenticacion.ensureAuth, productoControlador.productosAgotados);

module.exports = api;