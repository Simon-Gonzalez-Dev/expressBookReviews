const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    // Check if username exists in users array
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    // Check if username and password match
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    
    // Check if user exists and credentials are valid
    if (authenticatedUser(username, password)) {
        // Create JWT token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        
        // Store token in session
        req.session.authorization = {
            accessToken, username
        };
        
        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Get ISBN from request parameters
    const isbn = req.params.isbn;
    
    // Get review from request query
    const review = req.query.review;
    
    // Get username from session
    const username = req.session.authorization.username;
    
    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    
    // Check if review is provided
    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }
    
    // Initialize reviews object if it doesn't exist
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }
    
    // Add or modify review
    books[isbn].reviews[username] = review;
    
    return res.status(200).json({ 
        message: "Review added/modified successfully",
        reviews: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
