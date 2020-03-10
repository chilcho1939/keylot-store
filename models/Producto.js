const mongoose = require('mongoose');

const productoSchema = mongoose.Schema({
    descripcion: { type: String, required: true},
    activo: { type: Boolean, required: true},
    create_user: { type: String, required: true},
    create_date: { type: Date, required: true},
    update_user: { type: String, required: true},
    update_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("producto", productoSchema);