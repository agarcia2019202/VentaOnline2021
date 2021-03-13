'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'clave_secreta'

exports.ensureAuth = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ mensaje: 'La petición no tiene la cabezera de autorización' })        
    }    
    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);
        //exp = variable que contiene el tiempo de expiracion del token
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ mensaje: 'El token ha expirado' })
        }
    } catch (error) {
        return res.status(400).send({ mensaje: 'El token no es valido' })
    }

    req.user = payload;
    next();
}

exports.ensureAuthM = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({ mensaje: 'La petición no tiene la cabezera de autorización' })        
    }    
    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);
        //exp = variable que contiene el tiempo de expiracion del token
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ mensaje: 'El token ha expirado' })
        }else if(payload.rol == 'ROL_CLIENTE'){
                return res.status(418).send({ mensaje: 'Usted no es administrador.' })

            
        } 
    } catch (error) {
        return res.status(400).send({ mensaje: 'El token no es valido' })
    }

    req.user = payload;
    next();
}