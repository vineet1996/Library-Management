const express = require('express');
const router = express.Router();
const service = require('./issue.service');

router.get('/getPendingRequest', allRequestList); // all request list to admin.
router.post('/getUserPendingRequest', userRequestList); // all request list by user.
router.post('/getUserDataIssue', getUserDataIssue); // get user all issued data.
router.post('/deleteOldIssuedBook', deleteOldIssuedBook); // get user all issued data.
router.post('/userReturnBook', userReturnBook); // get user all issued data.
router.get('/adminAllOldData', adminAllOldData); // all users issued data to admin
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

function userReturnBook(req, res, next) {
    service.userReturnBook(req.body)
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
