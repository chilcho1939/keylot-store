const mongoose = require("mongoose");
const logger = require('./log4js');

module.exports = function (connectionString) {
    mongoose.connect(connectionString, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    }).then(() => {
        logger.info("Conectado a la base de datos");
    }).catch((error) => {
        logger.error("Error conectando a la base de datos: " + error);
    });
};