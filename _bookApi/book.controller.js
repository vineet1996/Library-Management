const express = require('express');
const router = express.Router();
const service = require('./book.service');

router.post('/createBook', newBookEntry); // new book entry API
router.get('/getBooks', getBooks); // get books API
router.post('/updateBook', updateBook); //update books API
router.post('/deleteBook', deleteBook);
module.exports = router;


function newBookEntry(req, res, next) {
    service.newBook(req.body)
    .then(books => {
        return  res.json(books);
    })
    .catch(err => next(err));
}

function getBooks(req, res, next) {
    service.getAllBooks()
    .then(books => {
        return  res.json(books);
    })
    .catch(err => next(err));
}

function updateBook(req, res, next) {
    service.updateBook(req.body)
    .then(books => {
        return  res.json(books);
    })
    .catch(err => next(err));
}

function deleteBook(req, res, next) {
    service.deleteBook(req.body)
    .then(books => {
        return  res.json(books);
    })
    .catch(err => next(err));
}