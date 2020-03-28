const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const usuarioSchema = mongoose.Schema({
    nombre: {type: String, required: [true, 'El nombre es requerido']},
    paterno: {type: String },
    materno: {type: String },
    imagen: {type: String },
    email: {type: String, required: [true, 'El email es requerido'], lowerCase: true, unique: true},
    password: {type: String, required: [true, 'La contraseña es requerida']},
    telefono: {type: String},
    perfil: {type: Array, default:[], required: [true, 'El perfil es requerido']},
    temporaryToken: {type: String, required: true},
    activo: { type: Boolean, default: false},
    create_user: { type: String, required: [false, "El usuario que crea es requerido"]},
    create_date: { type: Date, required: [false, "La fecha de creación es requerida"]},
    update_user: { type: String, required: [true, "El usuario que actualiza es requerido"]},
    update_date: { type: Date, default: Date.now }
});

usuarioSchema.plugin(uniqueValidator);

module.exports = mongoose.model("usuarios", usuarioSchema);