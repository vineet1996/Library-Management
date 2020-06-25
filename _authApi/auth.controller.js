const express = require('express');
const router = express.Router();
const service = require('./auth.service');

router.post('/login', authenticateLogin); //API for login
router.post('/newadmin', newadmin); // API for creating new admin 
router.post('/newuser', newuser); //API for creating new User

module.exports = router;

function authenticateLogin(req, res, next) {
    service.authentication(req.body)
    .then(user => {
        return  res.json(user);
    })
    .catch(err => next(err));
}

function newadmin(req, res, next) {
    service.createAdmin(req.body)
    .then(user => {
        return  res.json(user);
    })
    .catch(err => next(err));
}

function newuser(req, res, next) {
    service.createUser(req.body)
    .then(user => {
        return  res.json(user);
    })
    .catch(err => next(err));
}