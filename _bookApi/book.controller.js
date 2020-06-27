const express = require('express');
const router = express.Router();
const service = require('./book.service');

router.post('/createBook', newBookEntry); // API for new book entry.
router.get('/getBooks', getBooks); // API to get all books.
router.post('/updateBook', updateBook); // API update books.
router.post('/deleteBook', deleteBook); // API to delete book.
router.get('/searchResult/:string', getSearchResult); // API to search by name or author or publisher of the book.
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

function getSearchResult(req, res, next) {
    service.searchResults(req.params.string)
    .then(books => {
        return  res.json(books);
    })
    .catch(err => next(err));
}