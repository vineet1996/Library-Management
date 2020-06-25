const https = require('https')
const db = require('../_helpers/db');
const Book = db.Book;

module.exports = {
    newBook,
    getAllBooks,
    updateBook,
    deleteBook
};

async function getAllBooks() {
    let allBooks = await Book.find();
    return allBooks;
}

async function newBook(data) {
    let newEntry = new Book(data);
    let result = await newEntry.save();
    return getAllBooks();
}

async function updateBook(data) {
    let updateQuery = await Book.updateOne({_id: data.id}, {$set: data});
    return getAllBooks();
}

async function deleteBook(data) {
    let deletebook = await Book.remove({_id: data._id});
    return getAllBooks();
}
