const express = require('express');
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const logger = require("../configs/log4js");

router.post('/cargar', function(req, res, next) {
    logger.info("Cargando imagen");
    var body = req.body;
    if(!body.idCategoria || !body.nombreArchivo || !body.usuario || !body.base64) {
        return res.status(400).json({
            message: "Parametros incompletos, favor de validar",
            codigo: 99
        });
    }
    
    
});

module.exports = router;