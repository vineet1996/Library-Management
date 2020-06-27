const express = require('express');
const router = express.Router();
const service = require('./auth.service');

router.post('/login', authenticateLogin); //API for login
router.post('/newadmin', newadmin); // API for creating new admin 
router.post('/newuser', newuser); //API for creating new User
router.post('/getUserDetails', userDetails) ; //API to get user Details
router.post('/updateUser', userUpdateDetails); // API to update User.a
router.post('/passwordReset', passwordReset); // API to reset password
router.post('/updateMembership', updateMembership); //API to update memberShip
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

function userDetails(req, res, next) {
    service.UserDetailsService(req.body)
    .then(user => {
        return  res.json(user);
    })
    .catch(err => next(err));
}

function userUpdateDetails(req, res, next) {
    service.updateUserDetailsService(req.body)
    .then(user => {
        return  res.json(user);
    })
    .catch(err => next(err));
}

function passwordReset(req, res, next) {
    service.userPasswordReset(req.body)
    .then(user => {
        return  res.json(user);
    })
    .catch(err => next(err));
}

function updateMembership(req, res, next) {
    service.updateMembership(req.body)
    .then(user => {
        return  res.json(user);
    })
    .catch(err => next(err));
}