const express = require('express');
const router = express.Router();
const logger = require("../configs/log4js");
const Usuario = require("../models/usuario");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const checkAuth = require("../middleware/check-auth");
const Perfil = require('../models/perfil');

/**
 * Método que autentica a un usuario
 */
router.get('/login', function (req, res, next) {
    if ((!req.query.email || req.query.email == '') || (!req.query.password || req.query.password == '')) {
        return res.status(400).json({
            message: "El email y contraseña son requeridos",
            codigo: 99
        });
    }
    let fetchedUser;
    Usuario.findOne({
        email: req.query.email
    }).then(user => {
        if (!user) {
            logger.error("No se encontró el usuario");
            return res.status(401).json({
                message: "No se encontró el usuario"
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.query.password, user.password);
    }).then(result => {
        if (!result) {
            logger.error("Contraseña no válida");
            return res.status(401).json({
                message: "La autenticación falló"
            });
        }
        const token = jwt.sign({
            email: fetchedUser.email,
            userId: fetchedUser._id
        }, process.env.SECRET_WORD, {
            expiresIn: "1h"
        });
        res.status(200).json({
            code: 'ok',
            token: token,
            expiresIn: 3600,
            userId: fetchedUser._id,
            username: fetchedUser.username
        });
    }).catch(err => {
        logger.error(err);
        return res.status(401).json({
            message: "La autenticación falló",
            err: err
        });
    });
});

/**
 * Método que obtiene la información de un usuario
 */
router.get('/getById/:idUsuario', checkAuth, function (req, res, next) {
    if (!req.params.idUsuario || req.params.idUsuario == '') {
        return res.status(400).json({
            message: "Parametros incompletos, favor de validar",
            codigo: 99
        });
    }

    Usuario.findById({
        _id: req.params.idUsuario
    }, (err, data) => {
        if (err) {
            logger.error("Error al obtener la categoria: " + err);
            return res.status(500).json({
                codigo: 99,
                message: "Error al obtener la categoria",
                err: err.message
            });
        }

        if (!data) {
            return res.status(200).json({
                codigo: 0,
                message: "El usuario solicitado no existe, favor de vaidar"
            });
        }

        return res.status(200).json({
            codigo: 0,
            resultado: data
        });
    });
});

/**
 * Método que crea un usuario
 */
router.post('/create', function (req, res, next) {
    if ((!req.body.nombre || req.body.nombre == '') ||
        (!req.body.email || req.body.email == '') ||
        (!req.body.password || req.body.password == '') ||
        (!req.body.idPerfil || req.body.idPerfil == '')) {
        return res.status(400).json({
            message: "Parametros incompletos, favor de validar",
            codigo: 99
        });
    }

    Perfil.findById({
        _id: req.body.idPerfil
    }, (err, data) => {
        if (err) {
            logger.error("Error al obtener el perfil: " + err);
            return res.status(500).json({
                codigo: 99,
                message: "Error al obtener el perfil",
                err: err.message
            });
        }

        if (!data) {
            return res.status(200).json({
                codigo: 0,
                message: "No existe el perfil solicitado"
            });
        }

        //si viene imagen hay que copiarla al server en la ruta /images/users
        var imageName = '/images/users/user.jpg';

        bcrypt.hash(req.body.password, 10).then(hash => {
            const user = new Usuario({
                nombre: req.body.nombre,
                paterno: req.body.paterno,
                materno: req.body.materno,
                imagen: imageName,
                email: req.body.email,
                password: hash,
                telefono: req.body.telefono,
                perfil: data._id,
                temporaryToken: jwt.sign({
                    email: req.body.email
                }, process.env.SECRET_WORD, {
                    expiresIn: "1h"
                }),
                activo: true,
                create_user: 'admin',
                create_date: new Date(),
                update_user: 'admin'
            });

            //considerar el envio de correo para activar 

            user.save().then(response => {
                return res.status(200).json({
                    codigo: 0,
                    resultado: "Usuario creado exitosamente"
                });
            }).catch(err => {
                logger.error("Error al crear al usuario");
                return res.status(500).json({
                    codigo: 99,
                    message: 'Error al crear al usuario',
                    err: err.message
                });
            })
        })
    });

});

/**
 * Método que actualiza un usuario
 */
router.put('/update', function (req, res, next) {
    if (!req.body.idUsuario || req.body.idUsuario == '') {
        return res.status(400).json({
            message: "Parametros incompletos, favor de validar",
            codigo: 99
        });
    }

    Usuario.findByIdAndUpdate({
        _id: req.body.idUsuario
    }, {
        nombre: req.body.nombre,
        paterno: req.body.paterno,
        materno: req.body.materno,
        telefono: req.body.telefono,
        activo: req.body.activo,
        update_user: req.body.usuario,
        update_date: new Date()
    }, {
        useFindAndModify: false
    }, (err, data) => {
        if (err) {
            logger.error("Error actualizando al usuario: " + err);
            return res.status(500).json({
                codigo: 99,
                message: "Error actualizando al usuario",
                err: err.message
            });
        }
        return res.status(200).json({
            codigo: 0,
            message: 'Usuario actualizado exitosamente'
        });
    });
});

router.patch('/actualizarImagen', function (req, res, next) {
    if ((!req.body.idUsuario || req.body.idUsuario == '') || (!req.body.imagen || req.body.imagen == '')) {
        return res.status(400).json({
            message: "Parametros incompletos, favor de validar",
            codigo: 99
        });
    }

    // proceso para obtener la imagen del server y eliminarla, luego guardar la nueva y actualizarla en la entidad
});

module.exports = router;