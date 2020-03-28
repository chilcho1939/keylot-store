const jwt = require("jsonwebtoken");
const constants = require("../commons/constants");
const logger = require('../configs/log4js');

module.exports = (req, res, next) => {
    try {
        if (!req.headers.authorization) { 
            throw "No se encontró token, error!"
        }
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_WORD);
        req.userData = {
            email: decodedToken.email,
            userId: decodedToken.userId
        };
        next();
    } catch (err) {
        logger.error(err);
        res.status(401).json({
            message: "No autorizado",
            err: err.message
        });
    }

}