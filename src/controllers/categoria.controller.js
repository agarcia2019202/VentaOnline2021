'use strict'

const Usuario = require("../models/usuario.model");
const Categoria = require("../models/categoria.model");
const Factura = require("../models/factura.model");
const Producto = require("../models/producto.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");

//AGREGAR CATEGORIA
function agregarCategoria(req, res) {
    var categoriaModel = new Categoria();
    var params = req.body;

    if (params.nombreCategoria) {
        categoriaModel.nombreCategoria = params.nombreCategoria;

        Categoria.find({ $or: [
            { nombreCategoria: categoriaModel.nombreCategoria }
        ]}).exec((err, categoriaEncontrada)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la petición de la categoria.' })

            if (categoriaEncontrada && categoriaEncontrada.length >= 1) {
                return res.status(500).send({ mensaje: 'La categoria ya existe' })
            } else{
                categoriaModel.save((err, categoriaGuardada)=>{
                    if(err) return res.status(500).send({ mensaje: 'Error al guardar la categoria' })

                    if (categoriaGuardada) {
                        res.status(200).send(categoriaGuardada)
                    }else{
                        res.status(404).send({ mensaje: 'No se ha podido agregar la categoria.' })
                    }
                })
            }
        })
    } else{
        res.status(404).send({ mensaje: 'Debe llenar unicamente el nombre de la categoria.' })
    }
}

//EDITAR CATEGORIA
function editarCategoria(req, res){
    var idCategoria = req.params.idCategoria;
    var params = req.body;

    if(params.nombreCategoria){
        Categoria.find({ $or: [
            { nombreCategoria: params.nombreCategoria }
        ]}).exec((err, categoriaEncontrada)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la petición de la categoria.' })

            if (categoriaEncontrada && categoriaEncontrada.length >= 1) {
                return res.status(500).send({ mensaje: 'La categoria ya existe' })
            } else{
                Categoria.findByIdAndUpdate(idCategoria, params, { new: true }, (err, categoriaActualizada)=>{
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if(!categoriaActualizada) return res.status(500).send({ mensaje: 'No se ha podido actualizar la categoria' })
                    return res.status(200).send({ categoriaActualizada })
                })
            }
        })
    } else{
        res.status(200).send({ mensaje: 'Llene el nuevo nombre de la categoria' });
    }
}

//LISTAR CATEGORIAS(ADMIN-CLIENTES)
function listarCategorias(req, res){
    Categoria.find((err, categoriasEncontradas)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de comentario'})
        if(!categoriasEncontradas) return res.status(500).send({mensaje: 'Error al obtener el comentario'})
        return res.status(200).send({categoriasEncontradas})
    })
}

//ELIMINAR CATEGORIA - CATEGORIA DEFAULT
function eliminarCategoria(req, res){
    var idCategoria = req.params.idCategoria;
    var params = req.body;

    Categoria.find({nombreCategoria: 'categoria default'}, (err,categoriaEncontrada)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la petición de la categoria.' })

        if (categoriaEncontrada && categoriaEncontrada.length >= 1) {
            Producto.updateMany({idCategoriaProducto: idCategoria}, {idCategoriaProducto: categoriaEncontrada._id}, (err, productosActualizados)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la peticion del producto'});

                if(productosActualizados){
                    Categoria.findByIdAndDelete(idCategoria, (err, categoriaEliminada)=>{
                        if(err) return res.status(500).send({ mensaje: 'Error en la petición de la categoria.' })
                        if(!categoriaEliminada) return res.status(500).send({ mensaje: 'No se ha podido eliminar la categoria' })
                        return res.status(200).send([{productosActualizados}, {categoriaEliminada}]);
                    })
                }
            })
        } else{
            var categoriaModel = new Categoria();
            categoriaModel.nombreCategoria = 'categoria default';

            categoriaModel.save((err, categoriaGuardada)=>{
                if(err) return res.status(500).send({ mensaje: 'Error al guardar la categoria' })

                if(categoriaGuardada){
                    Producto.updateMany({idCategoriaProducto: idCategoria}, {idCategoriaProducto: categoriaGuardada._id}, (err, productosActualizados)=>{
                        if(err) return res.status(500).send({mensaje: 'Error en la peticion del producto'});
        
                        if(productosActualizados){
                            Categoria.findByIdAndDelete(idCategoria, (err, categoriaEliminada)=>{
                                if(err) return res.status(500).send({ mensaje: 'Error en la petición de la categoria.' })
                                if(!categoriaEliminada) return res.status(500).send({ mensaje: 'No se ha podido eliminar la categoria' })
                                return res.status(200).send([{productosActualizados},{categoriaEliminada}]);
                            })
                        }
                    })
                }else{
                    res.status(404).send({ mensaje: 'No se ha podido guardar la categoria default.' })
                }
            })

        }
    })

    
}

module.exports = {
    agregarCategoria,
    editarCategoria,
    listarCategorias,
    eliminarCategoria
}