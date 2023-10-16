const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  if (users.some(user => user.username === username)) {
    return false;
  } else {
    return true;
  }

}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  return (users.some(user => user.username === username && user.password === password))
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: { username: username, password: password }
      }, "secretKey", { expiresIn: '1h' })

    req.session.authenticated = { token: accessToken, data: { username: username, password: password } }
    return res.status(200).json({ message: "User successfully login" });
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.data.username;
  const isbn = req.params.isbn;
  const reviewText = req.body.review;
  if (!username) {
    return res.status(401).json({ error: 'You must be logged in to post a review.' });
  }

  if (!isbn || !reviewText) {
    return res.status(400).json({ error: 'ISBN and review are required.' });
  }

  if (!books[isbn]) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  // Find the book by ISBN in your books object
  const book = books[isbn];

  // Find an existing review by the same user for the specified ISBN
  const existingReview = book.reviews[username];

  if (existingReview) {
    // User has already reviewed this book, update the existing review
    existingReview.text = reviewText;
  } else {
    // User is posting a new review
    book.reviews[username] = { text: reviewText };
  }
  console.log('book review Object:', book.reviews);

  res.status(200).json({ message: 'Review added/modified successfully.' });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.data.username;

  if (!isbn) {
    return res.status(400).json({ error: "ISBN is required ." });
  }
  if (!username) {
    return res.status(401).json({ error: 'You must be logged in to post a review.' });
  }

  if (!books[isbn]) {
    return res.status(404).json({ error: 'Book not found.' });
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews['username'];
    res.status(200).json({ message: 'Review deleted successfully.' });
  } else {
    res.status(404).json({ error: 'Review not found.' });
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
