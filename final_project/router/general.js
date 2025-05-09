const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    // Get username and password from request body
    const username = req.body.username;
    const password = req.body.password;
    
    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    
    // Check if username already exists
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: "Username already exists" });
    }
    
    // Add new user to users array
    users.push({
        username: username,
        password: password
    });
    
    return res.status(200).json({ message: "User successfully registered" });
});

// Get the book list available in the shop using Promise
public_users.get('/', function (req, res) {
    // Create a Promise to handle the book list retrieval
    const getBooks = new Promise((resolve, reject) => {
        try {
            // Simulate some processing time
            setTimeout(() => {
                resolve(books);
            }, 100);
        } catch (error) {
            reject(error);
        }
    });

    // Handle the Promise
    getBooks
        .then((bookList) => {
            return res.status(200).send(JSON.stringify(bookList, null, 4));
        })
        .catch((error) => {
            console.error("Error fetching books:", error);
            return res.status(500).json({ message: "Error fetching books" });
        });
});

// Get book details based on ISBN using Promise
public_users.get('/isbn/:isbn', function (req, res) {
    // Create a Promise to handle the book retrieval
    const getBookByISBN = new Promise((resolve, reject) => {
        // Get the ISBN from request parameters
        const isbn = req.params.isbn;
        
        // Simulate some processing time
        setTimeout(() => {
            // Find the book with the matching ISBN
            const book = books[isbn];
            
            if (book) {
                resolve(book);
            } else {
                reject(new Error("Book not found"));
            }
        }, 100);
    });

    // Handle the Promise
    getBookByISBN
        .then((book) => {
            // Return the book details if found
            return res.status(200).send(JSON.stringify(book, null, 4));
        })
        .catch((error) => {
            // Return error if book not found
            return res.status(404).json({ message: error.message });
        });
});
  
// Get book details based on author using Promise
public_users.get('/author/:author', function (req, res) {
    // Create a Promise to handle the book retrieval
    const getBooksByAuthor = new Promise((resolve, reject) => {
        // Get the author from request parameters
        const author = req.params.author;
        
        // Simulate some processing time
        setTimeout(() => {
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
                resolve(booksByAuthor);
            } else {
                reject(new Error("No books found for this author"));
            }
        }, 100);
    });

    // Handle the Promise
    getBooksByAuthor
        .then((booksByAuthor) => {
            // Return the books if found
            return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
        })
        .catch((error) => {
            // Return error if no books found
            return res.status(404).json({ message: error.message });
        });
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
