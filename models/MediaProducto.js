const mongoose = require('mongoose');

const mediaProducto = mongoose.Schema({
    producto_id: { type: String, required: [true, "Se requiere una relación al producto"] },
    nombre_archivo: { type: String, required: [true, "El nombre del archivo es requerido"] },
    extension: { type: String, required: [true, "La extensión del archivo es requerida"] },
    path_archivo: {type: String, required: [true, "La ruta del archivo es requerida"] },
    create_user: { type: String, required: [true, "El usuario que crea es requerido"] },
    create_date: { type: Date, required: [true, "La fecha de creación es requerida"] },
    update_user: { type: String, required: [true, "El usuario que actualiza es requerido"] },
    update_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("media_producto", mediaProducto);