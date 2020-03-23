const express = require('express');
const router = express.Router();
const logger = require("../configs/log4js");
const Perfil = require('../models/perfil');

/**
 * Método que obtiene un perfil
 */
router.get('/getById/:idPerfil', function(req, res, next) {
    if(!req.params.idPerfil) {
        return res.status(400).json({
            message: "Parametros incompletos, favor de validar",
            codigo: 99
        });
    }

    Perfil.findById({
        _id: req.params.idPerfil
    }, (err, data) => {
        if (err) {
            logger.error("Error al obtener el perfil: " + err);
            return res.status(500).json({
                codigo: 99,
                message: "Error al obtener el perfil",
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

/**
 * Método que obtiene todos los perfiles
 */
router.get('/findAll', function(req, res, next) {
    Perfil.find({}, (err, docs)=> {
        if (err) {
            logger.error("Error obteniendo los perfiles: " + err);
            return res.status(500).json({
                codigo: 99,
                message: "Error obteniendo los perfiles",
                err: err.message
            });
        }
        logger.info(docs);
        return res.status(200).json({
            codigo: 0,
            resultado: docs || []
        });
    });
})

/**
 * Método para crear un nuevo perfil
 */
router.post('/crear', function(req, res, next) {
    const body = req.body;
    if( (!body.descripcion || body.descripcion == '') || (!body.usuario || body.usuario == '')) {
        return res.status(400).json({
            message: "Parametros incompletos, favor de validar",
            codigo: 99
        });
    }

    const perfil = new Perfil({
        descripcion: body.descripcion,
        activo: true,
        create_user: body.usuario,
        create_date: new Date(),
        update_user: body.usuario
    });

    perfil.save().then(result => {
        return res.status(200).json({
            codigo: 0,
            resultado: "Perfil creado exitosamente"
        });
    }).catch(err => {
        logger.error("Error al crear el perfil");
        return res.status(500).json({
            codigo: 99,
            message: 'Error al crear el perfil',
            err: err.message
        });
    })
});

/**
 * Método que actualiza un perfil
 */
router.put('/actualizar', function(req, res, next) {
    const body = req.body;
    if( (!body.idPerfil || body.idPerfil == '') || (!body.descripcion || body.descripcion == '') || (!body.usuario || body.usuario == '') || body.activo) {
        return res.status(400).json({
            message: "Parametros incompletos, favor de validar",
            codigo: 99
        });
    }

    Perfil.findByIdAndUpdate({
        _id: body.idPerfil
    }, {
        descripcion: body.descripcion,
        activo: body.activo,
        update_user: body.usuario,
        update_date: new Date()
    },{ useFindAndModify: false }, (err, data) => {
        if (err) {
            logger.error("Error actualizando el perfil: " + err);
            return res.status(500).json({
                codigo: 99,
                message: "Error actualizando el perfil",
                err: err.message
            });
        }
        
        return res.status(200).json({
            codigo: 0,
            message: 'Perfil actualizado exitosamente'
        });
    });
});

/**
 * Método que elimina un perfil (eliminar la relación en la tabla de usuario-perfil)
 */
router.delete('/eliminar/:idPerfil', function(req, res, next) {
    if(!req.params.idPerfil) {
        return res.status(400).json({
            message: "Parametros incompletos, favor de validar",
            codigo: 99
        });
    }

    Perfil.findOneAndDelete({
        _id: req.params.idCategoria
    }, (err, data) => {
        if (err) {
            logger.error("Error eliminando el perfil: " + err);
            return res.status(500).json({
                codigo: 99,
                message: "Error eliminando el perfil",
                err: err.message
            });
        }

        return res.status(200).json({
            codigo: 0,
            message: 'Perfil eliminado exitosamente'
        });
    });
});

module.exports = router;