const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
   // Send JSON response with formatted book data
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    // 1. Get all the keys of the books object
    const bookKeys = Object.keys(books);

    // 2. Iterate and find all books by this author
    let filteredBooks = [];
    
    bookKeys.forEach(key => {
        if (books[key].author === author) {
            filteredBooks.push(books[key]);
        }
    });

    // Return results
    if (filteredBooks.length > 0) {
        return res.send(JSON.stringify(filteredBooks, null, 4));
    }

    return res.status(404).json({ message: "No books found with this title" });
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    // 1. Get all the keys of the books object
    const bookKeys = Object.keys(books);

    // 2. Iterate and find all books by this author
    let filteredBooks = [];
    
    bookKeys.forEach(key => {
        if (books[key].title === title) {
            filteredBooks.push(books[key]);
        }
    });

    // Return results
    if (filteredBooks.length > 0) {
        return res.send(JSON.stringify(filteredBooks, null, 4));
    }

    return res.status(404).json({ message: "No books found for this author" });});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Check if the book exists
    if (books[isbn]) {
        return res.send(JSON.stringify(books[isbn].reviews, null, 4));
    }
    res.send("No Book with ISBN" + (' ') + (isbn) + " found");
});

module.exports.general = public_users;
