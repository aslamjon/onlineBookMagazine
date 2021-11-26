const { Router } = require("express");
const path = require("path");
const multer = require("multer");

const upload = require('express-fileupload')

const { createBook, getBook, getBooks, deleteBook, updateBook } = require("../controllers/bookController");

const router = Router();

// you might also want to set some limits: https://github.com/expressjs/multer#limits
// const upload = multer({
//     dest: path.join(__dirname, `./../data/cache`)
// });
// /* name attribute of <file> element in your form */
// const nameOfFileFromFrontend = upload.any();

// router.post('/create', upload(), createBook)
router.post('/create', createBook)
router.post('/', getBook)
router.get('/', getBooks)
router.delete('/:id', deleteBook)
router.put('/:id', updateBook)
// router.get('/', getBooks)

module.exports = {
    bookRouter: router
}