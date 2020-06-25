const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const book = new Schema({
    name: String,
    author: String,
    publish: String,
    takehome: {type:Boolean, default: false},
    stock: Number
});


module.exports = mongoose.model('Book', book);