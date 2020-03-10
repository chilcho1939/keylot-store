const mongoose = require('mongoose');

const mediaProducto = mongoose.Schema({
    producto_id: {type: String, required: true},
    nombre_archivo: {type: String, required: true},
    extension: {type: String, required: true},
    path_archivo: {type: String, require: true},
    create_user: { type: String, required: true},
    create_date: { type: Date, required: true},
    update_user: { type: String, required: true},
    update_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("media_producto", mediaProducto);