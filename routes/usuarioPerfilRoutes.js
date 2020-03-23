const express = require('express');
const router = express.Router();
const logger = require("../configs/log4js");
const UsuarioPerfil = require("../models/usaurioPerfil");

/**
 * Método que obtiene una entidad por los id's de usuario y perfil
 */
router.get('/getByUserAndProfile', function(req, res, next) {
    if(!req.params.idUsuario && !req.params.idPerfil) {
        return res.status(400).json({
            message: "Parametros incompletos, favor de validar",
            codigo: 99
        });
    }

    UsuarioPerfil.find({
        usuario_id: req.params.idUsuario,
        perfil_id: req.params.idPerfil
    }, (err, data) => {
        if (err) {
            logger.error("Error al obtener la relación: " + err);
            return res.status(500).json({
                codigo: 99,
                message: "Error al obtener la relación",
                err: err.message
            });
        }

        if(!data) {
            return res.status(200).json({
                codigo: 0,
                message: "Sin resultados para la busqueda"
            });
        }

        return res.status(200).json({
            codigo: 0,
            resultado: data
        });
    });
});

router.post('/crear', function(req, res, next) {
    if(!req.body.idUsuario || !req.body.idPerfil) {
        return res.status(400).json({
            message: "Parametros incompletos, favor de validar",
            codigo: 99
        });
    }

    const entity = new UsuarioPerfil({
        usuario_id: req.body.idUsuario,
        perfil_id: req.body.idPerfil,
        create_user: req.body.usuario,
        create_date: new Date(),
        update_user: req.body.usuario
    });

    entity.save().then( result => {
        return res.status(200).json({
            codigo: 0,
            resultado: "Relación usuario perfil creada exitosamente"
        });
    }).catch(err => {
        logger.error("Error al crear la realación usuario perfil");
        return res.status(500).json({
            codigo: 99,
            message: 'Error al crear la realación usuario perfil',
            err: err.message
        });
    });
});

module.exports = router;