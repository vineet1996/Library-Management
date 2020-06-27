const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    name: String,
    email: String,
    mobile: String,
    gender: String,
    membershipdays: Number,
    referencedate: Date,
    readinghours: Number,
    isadmin: {type: Boolean, default: false},
    username: {type: String, required: true},
    password: { type: String, required: true},
});


module.exports = mongoose.model('User', user);