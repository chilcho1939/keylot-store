const express = require('express');
const router = express.Router();
const fs = require('fs');
const checkAuth = require("../middleware/check-auth");
const logger = require("../configs/log4js");
const Ftp = require('ftp');
const constants = require('../commons/constants');
const MediaProducto = require('../models/MediaProducto');
const data = {
    host: process.env.URL_HOSTING_DATA,
    port: 21,
    secure: false,
    user: process.env.USER_HOSTING_DATA,
    password: process.env.PASSWORD_HOSTING_DATA
};

router.post('/cargar', function (req, res, next) {
    logger.info("Cargando imagen");
    var body = req.body;
    if (!body.idProducto || !body.nombreArchivo || !body.usuario || !body.base64 || !body.extension) {
        return res.status(400).json({
            message: "Parametros incompletos, favor de validar",
            codigo: 99
        });
    }

    fs.writeFile(constants.SERVER_IMAGE_PATH + body.nombreArchivo + '.' + body.extension, body.base64, {
        encoding: 'base64'
    }, function (err) {
        if (err) {
            logger.error(err);
            return res.status(500).json({
                codigo: 500,
                message: 'Error cargando la imagen',
                error: err
            });
        }
        logger.info("Archivo guardado en el server exitosamente");
        //copiando archivo por ftp al server
        logger.info("Conectando al server ftp")
        var ftpClient = new Ftp();
        ftpClient.on('ready', function () {
            logger.info("Conectado al server ftp");
            //copiar la imagen al server remoto
            ftpClient.put(constants.SERVER_IMAGE_PATH + body.nombreArchivo + '.' + body.extension, body.nombreArchivo + '.' + body.extension, function (err) {
                if (err) {
                    logger.error(err);
                    ftpClient.end();
                    return res.status(500).json({
                        codigo: 500,
                        message: 'Error cargando la imagen al servidor FTP',
                        error: err
                    });
                }
                logger.info("Archivo copiado al server remoto exitosamente");
                logger.info("Guardando entidad en la base de datos");
                const mediaProd = new MediaProducto({
                    producto_id: body.idProducto,
                    nombre_archivo: body.nombreArchivo,
                    path_archivo: 'http://amexicanrelocation.com/' + body.nombreArchivo + '.' + body.extension,
                    extension: body.extension,
                    create_user: body.usuario,
                    create_date: new Date(),
                    update_user: body.usuario
                });
                mediaProd.save().then(result => {
                    return res.status(200).json({
                        codigo: 0,
                        message: 'Archivo guardado exitosamente'
                    });
                }).catch(err => {
                    logger.error("Error guardando la imagen en la base de datos: " + err);
                });
                ftpClient.end();
            })
        });
        ftpClient.on('close', function () {
            logger.info("Conexión cerrada al server");
            //eliminar archivo en server local
            fs.unlink(constants.SERVER_IMAGE_PATH + body.nombreArchivo + '.' + body.extension, function (err) {
                if (err) logger.error("Error eliminando archivo en el servidor");
                else logger.info("Archivo eliminado del servidor exitosamente");
            })
        });
        ftpClient.on('error', function (err) {
            logger.error("Error conectando al server: " + err);
            ftpClient.end();
        });
        ftpClient.connect(data);
    });
});

router.get('/obtener/:imageId', function (req, res, next) {
    logger.info(req.params.imageId + " uno")
    if (!req.params.imageId) {
        return res.status(400).json({
            codigo: 99,
            message: 'Parámetros incompletos, favor de validar'
        });
    }
    MediaProducto.findById(req.params.imageId).then((result, err) => {
        if (err) {
            logger.error("Error obteniendo la imagen: " + err);
            return res.status(500).json({
                codigo: 99,
                message: "Error obteniendo la imagen",
                err: err
            });
        }
        if(!result) {
            return res.status(200).json({
                codigo: 0,
                message: "Sin resultados para la busqueda"
            });    
        }
        return res.status(200).json({
            codigo: 0,
            resultado: result
        });
    }).catch(err => {
        return res.status(500).json({
            codigo: 99,
            message: "Error obteniendo la imagen",
            err: err.message
        });
    });;
});

router.delete('/eliminar/:imageId', function (req, res, next) {
    if (!req.params.imageId) {
        return res.status(400).json({
            codigo: 99,
            message: 'Parámetros incompletos, favor de validar'
        });
    }
    MediaProducto.findById(req.params.imageId).then((result, err) => {
        if (err) {
            logger.error("Error obteniendo la imagen para eliminar");
            return res.status(500).json({
                codigo: 99,
                message: "Error obteniendo la imagen para eliminar",
                err: err
            });
        }
        if(!result) {
            return res.status(404).json({
                codigo: 99,
                message: "La imagen que deseas eliminar no existe"
            });
        }
        //Eliminar el file del server remoto
        var ftpClient = new Ftp();
        ftpClient.on('ready', function () {
            ftpClient.delete(result.nombre_archivo + '.' + result.extension, function(err) {
                if(err) {
                    logger.error("Error al eliminar la imagen en el servidor remoto: " + err);
                    ftpClient.end();
                    return res.status(404).json({
                        codigo: 99,
                        message: "Error al eliminar la imagen en el servidor remoto: " + err
                    });
                }
                MediaProducto.deleteOne({
                    _id: req.params.imageId
                }).then((response, err) => {
                    if (!response.deletedCount) {
                        ftpClient.end();
                        return res.status(500).json({
                            message: "Error al eliminar registro",
                            err: err
                        });
                    }
                    ftpClient.end();
                    return res.status(200).json({
                        codigo: 0,
                        message: "Registro eliminado existosamente"
                    });
                });
            });
        });
        ftpClient.on('close', function () {
            logger.info("Conexión cerrada al server remoto");
        });
        ftpClient.on('error', function (err) {
            logger.error("Error conectando al server remoto: " + err);
            ftpClient.end();
        });
        ftpClient.connect(data);
    }).catch(err => {
        return res.status(500).json({
            codigo: 99,
            message: "Error eliminando la imagen",
            err: err.message
        });
    });
});
module.exports = router;