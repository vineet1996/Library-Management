const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issue = new Schema({
    userId: String,
    bookId: String,
    takehome: {type: Boolean, default: false},
    pending: {type: Boolean, default: true},
    approval: Boolean,
    requesttime: Date,
    issuedtime: Date,
    returntime: Date,
});


module.exports = mongoose.model('Issue', issue);