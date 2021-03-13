'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var UsuariosSchema = Schema({
    nombre: String,
    usuario: String,
    rol: String,
    password: String
})

module.exports = mongoose.model('Usuarios', UsuariosSchema);