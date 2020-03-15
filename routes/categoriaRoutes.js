const express = require('express');
const router = express.Router();
const logger = require("../configs/log4js");
const Categoria = require('../models/Categoria');
const Producto = require('../models/Producto');
const MediaProducto = require('../models/MediaProducto');

/**
 * Método para obtener una categoría por id
 */
router.get('/getById/:idCategoria', function(req, res, next) {
    if(!req.params.idCategoria) {
        return res.status(400).json({
            message: "Parametros incompletos, favor de validar",
            codigo: 99
        });
    }

    Categoria.findById({
        _id: req.params.idCategoria
    }, (err, data) => {
        if (err) {
            logger.error("Error al obtener la categoria: " + err);
            return res.status(500).json({
                codigo: 99,
                message: "Error al obtener la categoria",
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
 * Método que obtiene todas las categorias
 */

 router.get('/findAll', function(req, res, next) {
    logger.info("Obteniendo todas las categorias");
    Categoria.find({}, (err, docs) => {
        if (err) {
            logger.error("Error obtiendo todas las categorias: " + err);
            return res.status(500).json({
                codigo: 99,
                message: "Error obtiendo todas las categorias",
                err: err
            });
        }

        return res.status(200).json({
            codigo: 0,
            resultado: docs
        });
    });
 });

/**
 * Método que crea una nueva categoria
 */
router.post('/crear', function(req, res, next) {
    if(!req.body.descripcion || (!req.body.usuario || req.body.usuario == '')) {
        return res.status(400).json({
            message: "La descripción y el usuario son requeridos, favor de validar",
            codigo: 99
        });
    }

    const categoria = new Categoria({
        descripcion: req.body.descripcion,
        create_user: req.body.usuario,
        create_date: new Date(),
        update_user: req.body.usuario
    });

    categoria.save().then((result) => {
        logger.info(result);
        return res.status(200).json({
            codigo: 0,
            resultado: "Categoría creada exitosamente"
        });
    }).catch(err => {
        logger.error("Error al crear la categoria");
        return res.status(500).json({
            codigo: 99,
            message: 'Error creando la categoria, favor de revisar',
            err: err.message
        });
    })
});

/**
 * Método que actualiza una categoría
 */
router.put('/actualizar', function(req, res, next){
    if(!req.body.idCategoria || (!req.body.descripcion || req.body.descripcion == '') || (!req.body.usuario || req.body.usuario == '')) {
        return res.status(400).json({
            message: "Parametros incompletos, favor de validar",
            codigo: 99
        });
    }

    Categoria.findByIdAndUpdate({
        _id: req.body.idCategoria
    }, {
        descripcion: req.body.descripcion,
        update_user: req.body.usuario,
        update_date: new Date()
    }, {useFindAndModify: false}, (err, data) => {
        if (err) {
            logger.error("Error actualizando la categoria: " + err);
            return res.status(500).json({
                codigo: 99,
                message: "Error actualizando el producto",
                err: err.message
            });
        }
        return res.status(200).json({
            codigo: 0,
            message: 'Categoria actualizada exitosamente'
        });
    });
});

/**
 * Método que elimina la categoría
 */
router.delete('/eliminar/:idCategoria', function(req, res, next){
    if(!req.params.idCategoria) {
        return res.status(400).json({
            message: "Parametros incompletos, favor de validar",
            codigo: 99
        });
    }

    Categoria.findOneAndDelete({
        _id: req.params.idCategoria
    }, (err, data) => {
        if (err) {
            logger.error("Error eliminando la categoría: " + err);
            return res.status(500).json({
                codigo: 99,
                message: "Error eliminando la categoría",
                err: err.message
            });
        }

        return res.status(200).json({
            codigo: 0,
            message: 'Categoría eliminada exitosamente'
        });
    });
});

module.exports = router;