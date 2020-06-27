const config = require('./dbconfig.json');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../models/user.model'),
    Book: require('../models/book.model'),
    Issue: require('../models/issue.model')
};
