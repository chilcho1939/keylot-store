const mongoose = require('mongoose');

const productoSchema = mongoose.Schema({
    categoria_id: { type: Array, default: [], required: [true, "La categoria del producto es requerida"]},
    titulo: { type: String, required: false},
    precio: { type: Number, required: false},
    calificacion: { type: Number, required: false},
    descripcion: { type: String, required: false},
    activo: { type: Boolean, required: false},
    create_user: { type: String, required: [false, "El usuario que crea es requerido"]},
    create_date: { type: Date, required: [false, "La fecha de creación es requerida"]},
    update_user: { type: String, required: [true, "El usuario que actualiza es requerido"]},
    update_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("productos", productoSchema);