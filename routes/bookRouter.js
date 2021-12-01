const { Router } = require("express");
const path = require("path");
const multer = require("multer");

const upload = require('express-fileupload')

const { createBook, getBook, getBooks, deleteBook, updateBook, bookForLandingPage, filterBook } = require("../controllers/bookController");
const { checkUser } = require("../middlewares/authMiddleware");

const router = Router();

// you might also want to set some limits: https://github.com/expressjs/multer#limits
// const upload = multer({
//     dest: path.join(__dirname, `./../data/cache`)
// });
// /* name attribute of <file> element in your form */
// const nameOfFileFromFrontend = upload.any();

// router.post('/create', upload(), createBook)
router.post('/create', checkUser, createBook);
router.post('/', checkUser, getBook);
router.get('/', checkUser, getBooks);
router.delete('/:id', checkUser, deleteBook);
router.put('/:id', checkUser, updateBook);
router.get('/landing', bookForLandingPage);
router.post('/filter', checkUser, filterBook);

module.exports = {
    bookRouter: router
}