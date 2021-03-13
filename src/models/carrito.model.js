'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var CarritoSchema = Schema({
    total: {type: Number, default: 0},
    productos: [{
        productoId: {type: Schema.Types.ObjectId, ref: 'Productos'},
        cantidad: Number,
        valorUnidad: Number
    }],
    propietarioCarrito: { type: Schema.Types.ObjectId, ref: 'Usuarios' }
})

module.exports = mongoose.model('Carrito', CarritoSchema);