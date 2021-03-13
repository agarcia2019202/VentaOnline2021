'use strict'

const Producto = require("../models/producto.model");
const Categoria = require("../models/categoria.model");
const Carrito = require("../models/carrito.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");


function agregarAlCarrito(req, res){
    var params = req.body;

    if(req.user.rol == 'ROL_ADMIN') return res.status(500).send({mensaje:'Usted no puede realizar compras, debe crear una cuenta de cliente.'})

    Carrito.find({propietarioCarrito: req.user.sub}, (err,carritoEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la petición del carrito.' })

        if (carritoEncontrado && carritoEncontrado.length >= 1) {

            Producto.findById(params.idProducto, (err, existenciasProducto)=>{
                if(err) return res.status(500).send({ mensaje: 'Error al obtener el producto' });
                if(!existenciasProducto) return res.status(500).send({ mensaje: 'No se ha podido encontrar' });

                if(params.cantidad <= 0) return res.status(500).send({ mensaje: 'Cantidad invalida' });
                if(params.cantidad > existenciasProducto.existencias) return res.status(500).send({ mensaje: 'Cantidad no disponible, intente con una cantidad menor' });

                Carrito.findOneAndUpdate({propietarioCarrito: req.user.sub}, {$push:{productos:{productoId: params.idProducto, cantidad: params.cantidad, valorUnidad: existenciasProducto.valor}}},
                    {new: true}, (err, productoAgregado)=>{
                        if(err) return res.status(500).send({ mensaje: 'Error' })
                        if(!productoAgregado) return res.status(500).send({ mensaje: 'Error al agregar el producto' })

                        Producto.findById(params.idProducto, (err, productoEncontrado)=>{
                            if(err) return res.status(500).send({ mensaje: 'Error' })
                            if(!productoEncontrado) return res.status(500).send({ mensaje: 'Error al obtener producto' })

                            var cantidad = params.cantidad;
                            var precio = productoEncontrado.valor;
                            var subtotal = productoAgregado.total;

                            var totalC = subtotal +(precio*cantidad);
                            Carrito.findOneAndUpdate({propietarioCarrito: req.user.sub}, {total: totalC}, {new: true}, (err, totalAgregado)=>{
                                    if(err) return res.status(500).send({ mensaje: 'Error' })
                                    if(!totalAgregado) return res.status(500).send({ mensaje: 'Error al agregar el total' })
                                    return res.status(500).send({totalAgregado})
                            })
                        })
                })
            })
            
        } else{
            var carritoModel = new Carrito();
            
            carritoModel.propietarioCarrito = req.user.sub;
            
            carritoModel.save((err, carritoGuardado)=>{
                if(err) return res.status(500).send({ mensaje: 'Error al guardar el carrito' })
                if(!carritoGuardado) return res.status(500).send({ mensaje: 'No se pudo guardar el carrito' })
                if(carritoGuardado){
                    Producto.findById(params.idProducto, (err, existenciasProducto)=>{
                        if(err) return res.status(500).send({ mensaje: 'Eror al obtener el producto' });
                        if(!existenciasProducto) return res.status(500).send({ mensaje: 'No se ha podido encontrar' });

                        if(params.cantidad <= 0) return res.status(500).send({ mensaje: 'Cantidad invalida' });
                        if(params.cantidad > existenciasProducto.existencias) return res.status(500).send({ mensaje: 'Cantidad no disponible, intente con una cantidad menor' });

                        Carrito.findOneAndUpdate({propietarioCarrito: req.user.sub}, {$push:{productos:{productoId: params.idProducto, cantidad: params.cantidad, valorUnidad: existenciasProducto.valor}}},
                            {new: true}, (err, productoAgregado)=>{
                                if(err) return res.status(500).send({ mensaje: 'Error1' })
                                if(!productoAgregado) return res.status(500).send({ mensaje: 'Error al agregar el producto' })

                                Producto.findById(params.idProducto, (err, productoEncontrado)=>{
                                    if(err) return res.status(500).send({ mensaje: 'Error2' })
                                    if(!productoEncontrado) return res.status(500).send({ mensaje: 'Error al obtener producto' })

                                    var cantidadX = params.cantidad;
                                    var precioX = productoEncontrado.valor;
                                    var subtotal = productoAgregado.total;

                                    var totalC = subtotal +(precioX*cantidadX);
                                    Carrito.findOneAndUpdate({propietarioCarrito: req.user.sub}, {total: totalC}, {new: true}, (err, totalAgregado)=>{
                                            if(err) return console.log(err) //return res.status(500).send({ mensaje: 'Error' })
                                            if(!totalAgregado) return res.status(500).send({ mensaje: 'Error al agregar el total' })
                                            return res.status(500).send({totalAgregado})
                                    })
                                })
                        })
                    })
                }
            })
            
        }
    })
}

function eliminarCarrito(req, res){

    Carrito.findOneAndDelete({ propietarioCarrito: req.user.sub }, (err, carritoEliminado) => {
        if(err) return res.status(500).send({ mensaje: 'Error al obtener el carrito' })
        if(!carritoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el carrito' })
        return res.status(200).send({carritoEliminado})

    } )
}

module.exports = {
    agregarAlCarrito,
    eliminarCarrito
}