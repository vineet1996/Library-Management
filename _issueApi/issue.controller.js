const express = require('express');
const router = express.Router();
const service = require('./issue.service');

router.get('/getPendingRequest', allRequestList); // API to get all request list to admin.
router.post('/getUserPendingRequest', userRequestList); // API to get all request list by particular user.
router.post('/getUserDataIssue', getUserDataIssue); // API to get user all issued data.
router.post('/deleteOldIssuedBook', deleteOldIssuedBook); // API to delete user old issued data.
router.get('/adminAllOldData', adminAllOldData); // API to get all users issued data to admin.

module.exports = router;

function allRequestList(req, res, next) {
    service.requestList()
    .then(books => {
        return  res.json(books);
    })
    .catch(err => next(err));
}

function userRequestList(req, res, next) {
    service.userrequestList(req.body)
    .then(books => {
        return  res.json(books);
    })
    .catch(err => next(err));
}

function getUserDataIssue(req, res, next) {
    service.getUserDataIssue(req.body)
    .then(books => {
        return  res.json(books);
    })
    .catch(err => next(err));
}

function deleteOldIssuedBook(req, res, next) {
    service.deleteOldIssuedBook(req.body)
    .then(books => {
        return  res.json(books);
    })
    .catch(err => next(err));
}

function adminAllOldData(req, res, next) {
    service.adminAllOldData()
    .then(books => {
        return  res.json(books);
    })
    .catch(err => next(err));
}
