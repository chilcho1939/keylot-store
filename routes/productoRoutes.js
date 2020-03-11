const express = require('express');
const router = express.Router();
const logger = require("../configs/log4js");
const constants = require('../commons/constants');
const Producto = require('../models/Producto');

/**
 * Método para obtener solo los datos del producto
 */
router.get('/getById/:idProducto', function(req, res, next){

});

/**
 * Método para obtener todos los productos por categoria con paginación
 */
router.get('/findByIdCategoria/:idCategoria', function(req, res, next){

});

/**
 * Método para obtener el producto con sus imagenes relacionadas
 */
router.get('/getProductAndImages/:idProducto', function(req, res, next){

});

/**
 * Método para crear un producto
 */
router.post('/crear', function(req, res, next){
    var body = req.body;
    if(!body.idCategoria || (!body.usuario || body.usuario == '')) {
        return res.status(400).json({
            message: "Parametros incompletos, favor de validar",
            codigo: 99
        });
    }
    const producto = new Producto({
        categoria_id: body.idCategoria,
        titulo: body.titulo,
        precio: body.precio,
        calificacion: body.calificacion,
        descripcion: body.descripcion,
        activo: true,
        create_user: body.usuario,
        create_date: new Date(),
        update_user: body.usuario
    });

    producto.save().then(result => {
        return res.status(200).json({
            codigo: 0,
            message: 'Producto creado exitosamente'
        });
    }).catch(err => {
        logger.error("Error al guardar el producto: " + err);
        return res.status(400).json({
            codigo: 99,
            message: 'Error guardando el producto, favor de revisar'
        });
    });

});

/**
 * Método para editar un producto
 */
router.put('/actualizar', function(req, res, next){

});

/**
 * Método para eliminar un producto y sus imagenes
 */
router.delete('/delete/:idProducto', function(req, res, next){

});

module.exports = router;