const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Model for book issue list by user.
const issue = new Schema({
    userId: String,
    bookId: String,
    takehome: {type: Boolean, default: false}, // Book issue to take home.
    pending: {type: Boolean, default: true}, // Book issue request status.
    approval: Boolean,
    requesttime: Date,
    returnrequest: Boolean, // Return book request status.
    issuedtime: Date,
    returntime: Date,
});


module.exports = mongoose.model('Issue', issue);