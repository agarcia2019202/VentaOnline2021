'use strict'

const Usuario = require("../models/usuario.model");
const Categoria = require("../models/categoria.model");
const Factura = require("../models/factura.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");8

//ADMIN DEFAULT
function adminDefault(req, res){
    var adminModel = new Usuario();
    var params;
            Usuario.findOne({$or:[{usuario: 'ADMIN'}]}, (err, userFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general, intentelo mas tarde'});
                }else if(userFind){
                    console.log('El admin ya fue creado')
                }else{
                    adminModel.usuario = 'ADMIN';
                    adminModel.rol = 'ROL_ADMIN';
                    adminModel.password = '123456';
 
                    bcrypt.hash(adminModel.password, null, null, (err, passwordHash)=>{
                        if(err){
                            res.status(500).send({message: 'Error al encriptar contraseña'});
                        }else if(passwordHash){
                            adminModel.password = passwordHash;

                            adminModel.save((err, userSaved)=>{
                   
                                if(err){
                                    res.status(500).send({message: 'Error general al guardar admin'});
                                }else if(userSaved){
                                    console.log('Admin creado correctamente', userSaved)
                                }else{
                                    res.status(404).send({message: 'Admin no guardado'});
                                }
                            });
                        }else{
                            res.status(418).send({message: 'Error inesperado'});
                        }
                    });
                }
            });   
}

adminDefault();

//CREAR USUARIOS CON ROL A ELECCION (ADMIN)
function registrarUsuarioAdmin(req, res) {
    var usuarioModel = new Usuario();
    var params = req.body;

    if(params.rol == 'ROL_CLIENTE' || params.rol == 'ROL_ADMIN'){

        if (params.nombre && params.usuario && params.rol && params.password) {
            usuarioModel.nombre = params.nombre;
            usuarioModel.usuario = params.usuario;
            usuarioModel.rol = params.rol;

            Usuario.find({ $or: [
                { usuario: usuarioModel.usuario }
            ]}).exec((err, usuarioEncontrado)=>{
                if(err) return res.status(500).send({ mensaje: 'Error en la petición del usuario.' })

                if (usuarioEncontrado && usuarioEncontrado.length >= 1) {
                    return res.status(500).send({ mensaje: 'El usuario ya existe' })
                } else{
                    bcrypt.hash(params.password, null, null, (err, passwordEncriptada)=>{
                        usuarioModel.password = passwordEncriptada;

                        usuarioModel.save((err, usuarioGuardado)=>{
                            if(err) return res.status(500).send({ mensaje: 'Error al guardar el usuario' })

                            if (usuarioGuardado) {
                                res.status(200).send(usuarioGuardado)
                            }else{
                                res.status(404).send({ mensaje: 'No se ha podido registrar el usuario.' })
                            }
                        })
                    })
                }
            })
        }
    } else{
        return res.status(500).send({mensaje: 'El rol debe ser escrito como ROL_ADMIN o ROL_CLIENTE'})
    }
}

//EDITAR CLIENTES/SUBIR DE RANGO
function editarClienteAdmin(req, res) {
    var idUsuario = req.params.idUsuario;
    var params = req.body;

    delete params.password;

    Usuario.findById(idUsuario, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la petición del usuario' })
        if(!usuarioEncontrado) return res.status(500).send({ mensaje: 'Error en obtener los datos' })
        if(usuarioEncontrado.rol == 'ROL_ADMIN'){
            return res.status(500).send({ mensaje: 'No tiene permiso para editar a otros administradores.' })
        } else{
            if(params.usuario){
                Usuario.find({ $or: [
                    { usuario: params.usuario }
                ]}).exec((err, usuarioExistente)=>{
                    if(err) return res.status(500).send({ mensaje: 'Error en la petición del usuario.' })

                    if (usuarioExistente && usuarioExistente.length >= 1) {
                        return res.status(500).send({ mensaje: 'El usuario ya existe' })
                    } else{
                        if(params.rol){
                            if(params.rol == 'ROL_CLIENTE' || params.rol == 'ROL_ADMIN'){
                                Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado)=>{
                                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                                    if(!usuarioActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar al usuario' })
                                    return res.status(200).send({ usuarioActualizado })
                                })
                            }else{
                                return res.status(200).send({mensaje: 'El rol debe ser escrito como ROL_ADMIN o ROL_CLIENTE' })
                            }
                        }else{
                            delete params.rol;
                            Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado)=>{
                                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                                if(!usuarioActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar al usuario' })
                                return res.status(200).send({ usuarioActualizado })
                            })
                        }
                    }
                })
            }else{
                delete params.usuario;
                if(params.rol){
                    if(params.rol == 'ROL_CLIENTE' || params.rol == 'ROL_ADMIN'){
                        Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado)=>{
                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                            if(!usuarioActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar al usuario' })
                            return res.status(200).send({ usuarioActualizado })
                        })
                    }else{
                        return res.status(200).send({mensaje: 'El rol debe ser escrito como ROL_ADMIN o ROL_CLIENTE' })
                    }
                }else{
                    delete params.rol;
                    Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err, usuarioActualizado)=>{
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                        if(!usuarioActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar al usuario' })
                        return res.status(200).send({ usuarioActualizado })
                    })
                }
            }            
        }
    })

    
}

//ELIMINAR CLIENTE(ADMIN)
function eliminarClienteAdmin(req, res) {
    var idUsuario = req.params.idUsuario;
    var params = req.body;

    Usuario.findById(idUsuario, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la petición del usuario' })
        if(!usuarioEncontrado) return res.status(500).send({ mensaje: 'Error en obtener los datos' })
        if(usuarioEncontrado.rol == 'ROL_ADMIN'){
            return res.status(500).send({ mensaje: 'No tiene permiso para eliminar a otros administradores.' })
        } else{
            Usuario.findByIdAndDelete(idUsuario, (err, usuarioEliminado)=>{
                if(err) return res.status(500).send({ mensaje: 'Error en la peticion de eliminar' });
                if(!usuarioEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el usuario' });

                return res.status(200).send({ usuarioEliminado });
            })
        }
    })
}

//REGISTRO DE CLIENTES
function registrarCliente(req, res) {
    var clienteModel = new Usuario();
    var params = req.body;

    if (params.nombre && params.usuario && params.password) {
        clienteModel.nombre = params.nombre;
        clienteModel.usuario = params.usuario;
        clienteModel.rol = 'ROL_CLIENTE';

        Usuario.find({ $or: [
            { usuario: clienteModel.usuario }
        ]}).exec((err, clienteEncontrado)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la petición del usuario.' })

            if (clienteEncontrado && clienteEncontrado.length >= 1) {
                return res.status(500).send({ mensaje: 'El usuario ya existe' })
            } else{
                bcrypt.hash(params.password, null, null, (err, passwordEncriptada)=>{
                    clienteModel.password = passwordEncriptada;

                    clienteModel.save((err, clienteGuardado)=>{
                        if(err) return res.status(500).send({ mensaje: 'Error al guardar el cliente' })

                        if (clienteGuardado) {
                            res.status(200).send(clienteGuardado)
                        }else{
                            res.status(404).send({ mensaje: 'No se ha podido registrar el cliente.' })
                        }
                    })
                })
            }
        })
    }
}

//EDITAR MI PERFIL
function editarUsuario(req, res) {
    var params = req.body;

    delete params.password;
    delete params.rol;

    if(params.usuario){
        Usuario.find({ $or: [
            { usuario: params.usuario }
        ]}).exec((err, usuarioExistente)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la petición del usuario.' })

            if (usuarioExistente && usuarioExistente.length >= 1) {
            return res.status(500).send({ mensaje: 'El usuario ya existe' })
            } else{
                Usuario.findByIdAndUpdate(req.user.sub, params, { new: true }, (err, usuarioActualizado)=>{
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if(!usuarioActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar al usuario' })
                    return res.status(200).send({ usuarioActualizado })
                })
            }
        })
    }else{
        delete params.usuario;
        Usuario.findByIdAndUpdate(req.user.sub, params, { new: true }, (err, usuarioActualizado)=>{
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if(!usuarioActualizado) return res.status(500).send({ mensaje: 'No se ha podido actualizar al usuario' })
            return res.status(200).send({ usuarioActualizado })
        })
    }
}

//ELIMINAR MI PERFIL
function eliminarUsuario(req, res) {

    Usuario.findByIdAndDelete(req.user.sub, (err, empresaEliminada)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de eliminar' });
        if(!empresaEliminada) return res.status(500).send({ mensaje: 'Error al eliminar la empresa' });

        return res.status(200).send({ empresaEliminada });
    })
}

//LOGIN
function login(req, res) {
    var params = req.body;

    Usuario.findOne({ usuario: params.usuario }, (err, usuarioEncontrado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });

        if(usuarioEncontrado){                                          
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, passCorrecta)=>{
                if (passCorrecta) {
                    if(params.obtenerToken = 'true' && usuarioEncontrado.rol == 'ROL_CLIENTE'){

                        Factura.find({ propietarioCarrito: usuarioEncontrado._id }, (err, comprasRealizadas)=>{
                            if(err) return res.status(500).send({mensaje: 'Error en la peticion de comentario'})
                            if(!comprasRealizadas) return res.status(500).send({mensaje: 'Error al obtener el comentario'})
                        
                            return res.status(200).send({token: jwt.createToken(usuarioEncontrado),comprasRealizadas});
                        })
                    } else if(params.obtenerToken = 'true'){
                        return res.status(200).send({token: jwt.createToken(usuarioEncontrado)} );
                    } else{
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({ usuarioEncontrado })
                    }
                } else{
                    return res.status(404).send({ mensaje: 'El usuario no se ha podido identificar' })
                }
            })
        } else{
            return res.status(404).send({ mensaje: 'El usuario no ha podido ingresar' })
        }
    })
}

//LISTAR USUARIOS
function listarUsuarios(req, res){
    Usuario.find((err, usuariosEncontrados)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de comentario'})
        if(!usuariosEncontrados) return res.status(500).send({mensaje: 'Error al obtener el comentario'})
        return res.status(200).send({usuariosEncontrados})
    })
}

module.exports = {
    registrarUsuarioAdmin,
    editarClienteAdmin,
    eliminarClienteAdmin,
    registrarCliente,
    editarUsuario,
    eliminarUsuario,
    login,
    listarUsuarios
}