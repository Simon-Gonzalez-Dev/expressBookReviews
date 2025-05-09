const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Return the complete list of books with formatted JSON output
  return res.status(300).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Get the ISBN from request parameters
    const isbn = req.params.isbn;
    
    // Find the book with the matching ISBN
    const book = books[isbn];
    
    if (book) {
        // Return the book details if found
        return res.status(200).send(JSON.stringify(book, null, 4));
    } else {
        // Return error if book not found
        return res.status(404).json({ message: "Book not found" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Get the author from request parameters
    const author = req.params.author;
    
    // Get all book IDs
    const bookIds = Object.keys(books);
    
    // Find books by the specified author
    const booksByAuthor = bookIds.filter(id => 
        books[id].author.toLowerCase() === author.toLowerCase()
    ).map(id => ({
        isbn: id,
        ...books[id]
    }));
    
    if (booksByAuthor.length > 0) {
        // Return the books if found
        return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
    } else {
        // Return error if no books found
        return res.status(404).json({ message: "No books found for this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Get the title from request parameters
    const title = req.params.title;
    
    // Get all book IDs
    const bookIds = Object.keys(books);
    
    // Find books by the specified title
    const booksByTitle = bookIds.filter(id => 
        books[id].title.toLowerCase() === title.toLowerCase()
    ).map(id => ({
        isbn: id,
        ...books[id]
    }));
    
    if (booksByTitle.length > 0) {
        // Return the books if found
        return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
    } else {
        // Return error if no books found
        return res.status(404).json({ message: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Get the ISBN from request parameters
    const isbn = req.params.isbn;
    
    // Find the book with the matching ISBN
    const book = books[isbn];
    
    if (book) {
        // Return the reviews if book is found
        return res.status(200).send(JSON.stringify(book.reviews, null, 4));
    } else {
        // Return error if book not found
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
