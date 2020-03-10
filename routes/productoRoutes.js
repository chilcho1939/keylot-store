const express = require('express');
const router = express.Router();
const logger = require("../configs/log4js");
const constants = require('../commons/constants');

/**
 * Método para obtener solo los datos del producto
 */
router.get('/getById', function(req, res, next){

});

/**
 * Método para obtener todos los productos por categoria con paginación
 */
router.get('/findByIdCategoria', function(req, res, next){

});

/**
 * Método para obtener el producto con sus imagenes relacionadas
 */
router.get('/getProductAndImages', function(req, res, next){

});

/**
 * Método para crear un producto
 */
router.post('/create', function(req, res, next){

});

/**
 * Método para editar un producto
 */
router.put('/update', function(req, res, next){

});

/**
 * Método para eliminar un producto y sus imagenes
 */
router.delete('/delete', function(req, res, next){

});

module.exports = router;