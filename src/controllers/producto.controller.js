'use strict'

const Producto = require("../models/producto.model");
const Categoria = require("../models/categoria.model");
const Factura = require("../models/factura.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");

//AGREGAR NUEVO PRODUCTO
function agregarProducto(req, res) {
    var params = req.body;
    var productoModel = new Producto();

    if (params.nombreProducto && params.valor && params.existencias && params.idCategoriaProducto) {
        productoModel.nombreProducto = params.nombreProducto,
        productoModel.valor = params.valor,
        productoModel.existencias = params.existencias,
        productoModel.cantidadVendida = 0,
        productoModel.idCategoriaProducto = params.idCategoriaProducto;

        Producto.find({ $or: [
            { nombreProducto: productoModel.nombreProducto }
        ]}).exec((err, productoEncontrado)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la petición del producto.' })

            if (productoEncontrado && productoEncontrado.length >= 1) {
                return res.status(500).send({ mensaje: 'El producto ya existe' })
            } else{
                productoModel.save((err, productoGuardado)=>{
                    if(err) return res.status(500).send({ mensaje: 'Error en la peticion del producto' });
                    if(!productoGuardado) return res.status(500).send({ mensaje: 'Error al agregar el producto' });

                    return res.status(200).send({ productoGuardado });
                })
            }
        })
    } else{
        res.status(500).send({ mensaje: 'Rellene los datos necesarios para agregar el producto' })
    }
}

//EDITAR PRODUCTO
function editarProducto(req, res) {
    var idProducto = req.params.idProducto;
    var params = req.body;
    
    if(params.nombreProducto){
        Producto.find({ $or: [
            { nombreProducto: params.nombreProducto }
        ]}).exec((err, productoExistente)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la petición del producto.' })

            if (productoExistente && productoExistente.length >= 1) {
                return res.status(500).send({ mensaje: 'El producto ya existe' })
            } else{
                Producto.findByIdAndUpdate(idProducto, params, { new: true }, (err, productoActualizado)=>{
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if(!productoActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar al usuario' })
                    return res.status(200).send({ productoActualizado })
                })
            }
        })
    }else{
        delete params.nombreProducto;
        Producto.findByIdAndUpdate(idProducto, params, { new: true }, (err, productoActualizado)=>{
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if(!productoActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar al usuario' })
            return res.status(200).send({ productoActualizado })
        })            
    }            
}

//ELIMINAR PRODUCTO
function eliminarProducto(req, res) {
    var idProducto = req.params.idProducto;
    
    Producto.findByIdAndDelete(idProducto, (err, productoEliminado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la petición del producto.' })
        if(!productoEliminado) return res.status(500).send({ mensaje: 'No se ha podido eliminar el producto' })
        return res.status(200).send({productoEliminado});
    })
}

//LISTAR PRODUCTOS
function listarProductos(req, res) {
    //Encuesta.find({ titulo: { $regex: 'encuesta', $options: 'i' } }, { listaComentarios: 0})
    Producto.find().populate('idCategoriaProducto', 'nombreCategoria').exec((err, productosEncontrados)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de encuestas' });
        if(!productosEncontrados) return res.status(500).send({ mensaje: 'Error al obtener las encuestas' });
        return res.status(200).send({ productosEncontrados });
    });
}

//BUSCAR PRODUCTOS POR NOMBRE
function buscarProductosNombre(req, res) {
    var nombre = req.body.nombreProducto;
    //Encuesta.find({ titulo: { $regex: 'encuesta', $options: 'i' } }, { listaComentarios: 0})
    Producto.find({nombreProducto: { $regex: nombre, $options: 'i' }}).populate('idCategoriaProducto', 'nombreCategoria').exec((err, productosEncontrados)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de encuestas' });
        if(!productosEncontrados) return res.status(500).send({ mensaje: 'Error al obtener las encuestas' });
        return res.status(200).send({ productosEncontrados });
    });
}

//BUSCAR PRODUCTOS POR CATEGORIA
function buscarProductosCategoria(req, res) {
    var idCategoria = req.params.idCategoria;

    Producto.find({idCategoriaProducto: idCategoria}).populate('idCategoriaProducto', 'nombreCategoria').exec((err, productosEncontrados)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de encuestas' });
        if(!productosEncontrados) return res.status(500).send({ mensaje: 'Error al obtener las encuestas' });
        return res.status(200).send({ productosEncontrados });
    });
}

function productosMasVendidos(req, res) {
    Producto.find().populate('idCategoriaProducto', 'nombreCategoria').sort({cantidadVendida: -1}).limit(-5).exec((err, productosEncontrados)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de encuestas' });
        if(!productosEncontrados) return res.status(500).send({ mensaje: 'Error al obtener las encuestas' });
        return res.status(200).send({ productosEncontrados });
    })    
}

function productosAgotados(req, res) {
    Producto.find({existencias: 0}).populate('idCategoriaProducto', 'nombreCategoria').exec((err, productosEncontrados)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de encuestas' });
        if(!productosEncontrados) return res.status(500).send({ mensaje: 'Error al obtener las encuestas' });
        return res.status(200).send({ productosEncontrados });
    })    
}

module.exports = {
    agregarProducto,
    listarProductos,
    editarProducto,
    eliminarProducto,
    buscarProductosNombre,
    buscarProductosCategoria,
    productosMasVendidos,
    productosAgotados
}