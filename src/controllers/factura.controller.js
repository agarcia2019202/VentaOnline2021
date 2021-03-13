'use strict'

const Producto = require("../models/producto.model");
const Categoria = require("../models/categoria.model");
const Carrito = require("../models/carrito.model");
const Factura = require("../models/factura.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const { productosMasVendidos } = require("./producto.controller");

function comprar(req, res){
    var facturaModel = new Factura();

    Carrito.findOne({propietarioCarrito: req.user.sub}, (err, carritoEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!carritoEncontrado) return res.status(500).send({mensaje: 'Error al buscar el carrito'});
        
            facturaModel.total = carritoEncontrado.total;
            facturaModel.productos = carritoEncontrado.productos;
            facturaModel.propietarioCarrito = req.user.sub;
            
            var productosC = carritoEncontrado.productos;
            productosC.forEach(function (element) {
                Producto.findById(element.productoId,(err, productoEncontrado) =>{
                    if(err) return res.status(404).send({mensaje: 'Error'})
                    if(!productoEncontrado) return res.status(404).send({ mensaje:'Error al encontrar los productos'})
                    Producto.findByIdAndUpdate(element.productoId, {existencias: productoEncontrado.existencias - element.cantidad}, (err, productoVendido)=>{
                        if(err) return res.status(500).send({mensaje: 'Error general'})
                        if(!productoVendido) return res.status(500).send({mensaje: 'Error en la peticion del producto'});
                        Producto.findByIdAndUpdate(element.productoId, {$inc:{cantidadVendida: +1}}, (err, productoVendido2)=>{
                            if(err) return res.status(500).send({mensaje: 'Error general 2'})
                            if(!productoVendido2) return res.status(500).send({mensaje: 'Error en la peticion del producto'});
    
                        })

                    })
                })
            })

            Carrito.findOneAndDelete({propietarioCarrito: req.user.sub}, (err, carritoEliminado)=>{
                if(err) return res.status(500).send({mensaje: 'Error 2'})
                if(!carritoEliminado) return res.status(500).send({mensaje: 'Error en la peticion del carrito'});
            });
            facturaModel.save((err, facturaGuardada)=>{
                if(err) return res.status(500).send({mensaje: 'Error 3'} );
                if(!facturaGuardada){
                    return res.status(500).send({mensaje: 'Error al guardar la factura'});
                }else{
                    return res.status(200).send({facturaGuardada});
                }
            })     
    })
}

function todasLasFacturas(req, res) {
    //Encuesta.find({ titulo: { $regex: 'encuesta', $options: 'i' } }, { listaComentarios: 0})
    Factura.find().populate('productos.productoId', 'nombreProducto').exec((err, facturasEncontradas)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de encuestas' });
        if(!facturasEncontradas) return res.status(500).send({ mensaje: 'Error al obtener las encuestas' });
        return res.status(200).send({ facturasEncontradas });
    });
}


module.exports = {
    comprar,
    todasLasFacturas
}