const mongoose = require('mongoose');

const perfilSchema = mongoose.Schema({
    descripcion: {type: String, requred: [true, 'La descripcion del perfil es requerida']},
    activo: {type: Boolean, default: false, requred: true},
    create_user: { type: String, required: [false, "El usuario que crea es requerido"]},
    create_date: { type: Date, required: [false, "La fecha de creación es requerida"]},
    update_user: { type: String, required: [true, "El usuario que actualiza es requerido"]},
    update_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("perfils", perfilSchema);