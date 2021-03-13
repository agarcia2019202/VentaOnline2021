'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var CategoriasSchema = Schema({
    nombreCategoria: String
})

module.exports = mongoose.model('Categorias', CategoriasSchema);