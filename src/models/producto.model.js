'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var ProductosSchema = Schema({
    nombreProducto: String,
    valor: Number,
    existencias: Number,
    cantidadVendida: Number,
    idCategoriaProducto: { type: Schema.Types.ObjectId, ref: 'Categorias' }
})

module.exports = mongoose.model('Productos', ProductosSchema);