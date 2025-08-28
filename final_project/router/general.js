const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 10 resolved"));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const get_books_isbn = new Promise((resolve, reject) => {
    let book = books[isbn];
    if (book) {
        resolve(res.send(book));
    } else {
        reject(res.status(404).json({message: "ISBN not found"}));
    }
  });

  get_books_isbn.
    then(() => console.log("Promise for Task 11 resolved")).
    catch(() => console.log("Promise for Task 11 rejected"));

 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const get_books_author = new Promise((resolve, reject) => {
        let booksbyauthor = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
          if(books[isbn]["author"] === author) {
            booksbyauthor.push({"isbn":isbn,
                                "title":books[isbn]["title"],
                                "reviews":books[isbn]["reviews"]});
          }
        });
        if (booksbyauthor.length > 0) {
            resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
        } else {
            reject(res.status(404).json({message: "Author not found"}));
        }
    });

    get_books_author.
        then(() => console.log("Promise for Task 12 resolved")).
        catch(() => console.log("Promise for Task 12 rejected"));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const get_books_title = new Promise((resolve, reject) => {
        let booksbytitle = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
          if(books[isbn]["title"] === title) {
            booksbytitle.push({"isbn":isbn,
                                "author":books[isbn]["author"],
                                "reviews":books[isbn]["reviews"]});
          }
        });

        if (booksbytitle.length > 0) {
            resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
        } else {
            reject(res.status(404).json({message: "Title not found"}));
        }
    });

    get_books_title.
        then(() => console.log("Promise for Task 13 resolved")).
        catch(() => console.log("Promise for Task 13 rejected"));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"])
});

module.exports.general = public_users;