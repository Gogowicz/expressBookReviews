const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
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


// Async Wait: Get all books
public_users.get('/', async (req, res) => {
    try {
        const data = await new Promise((resolve, reject) => {
            resolve(books);
        });
        res.send(JSON.stringify(data, null, 4));
    } catch (err) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});


// Async Wait:: Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const book = await new Promise((resolve, reject) => {
            if (books[isbn]) resolve(books[isbn]);
            else reject("Book not found");
        });

        res.send(book);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});


// Async Wait: Get books by author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;

    try {
        const result = await new Promise((resolve, reject) => {
            const bookKeys = Object.keys(books);
            let filteredBooks = [];

            bookKeys.forEach(key => {
                if (books[key].author === author) {
                    filteredBooks.push(books[key]);
                }
            });

            if (filteredBooks.length > 0) resolve(filteredBooks);
            else reject("No books found for this author");
        });

        res.send(JSON.stringify(result, null, 4));
    } catch (err) {
        res.status(404).json({ message: err });
    }
});


// Async Wait: Get books by title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;

    try {
        const result = await new Promise((resolve, reject) => {
            const bookKeys = Object.keys(books);
            let filteredBooks = [];

            bookKeys.forEach(key => {
                if (books[key].title === title) {
                    filteredBooks.push(books[key]);
                }
            });

            if (filteredBooks.length > 0) resolve(filteredBooks);
            else reject("No books found with this title");
        });

        res.send(JSON.stringify(result, null, 4));
    } catch (err) {
        res.status(404).json({ message: err });
    }
});


// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.send(JSON.stringify(books[isbn].reviews, null, 4));
    }
    res.send("No Book with ISBN " + isbn + " found");
});

module.exports.general = public_users;