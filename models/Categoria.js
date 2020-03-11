const mongoose = require('mongoose');

const categoria = mongoose.Schema({
    descripcion: { type: String, required: [true, "La descripción de la categoria es requerida"]},
    create_user: { type: String, required: [true, "El usuario que crea es requerido"]},
    create_date: { type: Date, required: [true, "La fecha de creación es requerida"]},
    update_user: { type: String, required: [true, "El usuario que actualiza es requerido"]},
    update_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("categoria", categoria);