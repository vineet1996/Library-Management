const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Model for books list in the library
const book = new Schema({
    name: String,
    author: String,
    publish: String,
    takehome: {type:Boolean, default: false}, // book assign for isssue to take home
    stock: Number
});


module.exports = mongoose.model('Book', book);