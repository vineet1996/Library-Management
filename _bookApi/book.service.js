const https = require('https')
const db = require('../_helpers/db');
const Book = db.Book;

module.exports = {
    newBook,
    getAllBooks,
    updateBook,
    deleteBook,
    searchResults
};

// Function to get all books from db.
async function getAllBooks() {
    let allBooks = await Book.find();
    return allBooks;
}

// Function to entry new book to db.
async function newBook(data) {
    let newEntry = new Book(data);
    let result = await newEntry.save();
    return getAllBooks();
}

// Function to update book to db.
async function updateBook(data) {
    let updateQuery = await Book.updateOne({_id: data.id}, {$set: data});
    return getAllBooks();
}

// Function to delete book from db.
async function deleteBook(data) {
    let deletebook = await Book.remove({_id: data._id});
    return getAllBooks();
}

// Function to search book from db.
async function searchResults(str) {
    let searchres = await Book.find({
                                   $or: [
                                        {name: {$regex: str, $options: 'i'}},
                                        {author: {$regex: str, $options: 'i'}},
                                        {publish: {$regex: str, $options: 'i'}}
                                    ]
                                });
    return searchres;
}
