'use strict'

//IMPORTACIONES
const express = require("express")
const usuarioControlador = require("../controllers/usuario.controller");

// MIDDLEWARE
var md_autenticacion = require("../middlewares/authenticated")

//RUTAS
var api = express.Router();

api.post('/login', usuarioControlador.login);
api.post('/registrarUsuarioAdmin', md_autenticacion.ensureAuthM, usuarioControlador.registrarUsuarioAdmin);
api.put('/editarClienteAdmin/:idUsuario', md_autenticacion.ensureAuthM, usuarioControlador.editarClienteAdmin);
api.delete('/eliminarClienteAdmin/:idUsuario', md_autenticacion.ensureAuthM, usuarioControlador.eliminarClienteAdmin);
api.post('/registrarCliente', usuarioControlador.registrarCliente);
api.put('/editarUsuario', md_autenticacion.ensureAuth, usuarioControlador.editarUsuario);
api.delete('/eliminarUsuario', md_autenticacion.ensureAuth, usuarioControlador.eliminarUsuario);
api.get('/listarUsuarios', md_autenticacion.ensureAuthM, usuarioControlador.listarUsuarios);



module.exports = api;