// Dependencies
var express = require('express');
var router = express.Router();

// Models
var Product = require('../models/reportes');

// Routes
Product.methods(['get', 'post']);
Product.register(router, '/reportes');

// Return router
module.exports = router;