
// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var productSchema = new mongoose.Schema({
    tipo: String,
    latitud: String,
    longitud: String,
    fecha: String,
    desc: String,
});

// Return model
module.exports = restful.model('Products', productSchema);
