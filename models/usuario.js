const mongoose = require('mongoose');

const perfilSchema = mongoose.Schema({
    usuario_id: {type: String, required: [true, 'El id del usuario es requerido']},
    perfil_id: {type: String, required: [true, 'El perfil es requerido']},
    create_user: { type: String, required: [false, "El usuario que crea es requerido"]},
    create_date: { type: Date, required: [false, "La fecha de creación es requerida"]},
    update_user: { type: String, required: [true, "El usuario que actualiza es requerido"]},
    update_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("usuario", perfilSchema);