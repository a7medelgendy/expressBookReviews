const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (isValid(username)) {
    users.push({ "username": username, "password": password });
    return res.status(200).json({ message: "User successfully registred. Now you can login" });
  } else {
    return res.status(409).json({ error: 'Username already exists.' })
  }

});














// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.status(200).send(JSON.stringify(books, null, 4));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (!isbn) {
    return res.status(400).json({ error: "ISBN is required ." });
  }

  let book = books[isbn];

  if (book) {
    res.status(200).send(JSON.stringify(book));
  } else {
    res.status(500).send("this book not found");
  }
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const bookArray = Object.values(books);
  let book = bookArray.filter((book) => {
    return (book.author === author)
  })

  if (book.length > 0) {
    res.status(200).send(JSON.stringify(book));
  } else {
    res.status(500).send("this author not found");
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  const bookArray = Object.values(books)
  let book = bookArray.filter((book) => {
    return (book.title === title)
  })

  if (book.length > 0) {
    res.status(200).send(JSON.stringify(book));
  } else {
    res.status(500).send("this book not found");
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    res.status(200).send(JSON.stringify(book.reviews));
  } else {
    res.status(500).send("this book not found");
  }
});

module.exports.general = public_users;
