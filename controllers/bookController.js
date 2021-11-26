// const _ = require('lodash');
const path = require("path");
const { BookModel } = require("../models/bookModel");
const { UserModel } = require("../models/userModel");
const { decodingBase64, formatDate, unlink } = require("../utiles");

async function createBook(req, res) {
    const { img, title, description, price, descount, author, year, genre, ISBN, language, bookFormat, tags } = req.body;

    const today = new Date();
    
    
    if ( !img.imgFile || !title || !description || !price || !author || !year || !genre || !language) res.status(400).send({ message: "Bad request" })
    else {
        const bookExists = await BookModel.findOne({ title });

        if (bookExists) {
            res.status(400).send({ message: "This book is already exists" });
        } else {
            const { userId } = req.user;
            const user = await UserModel.findById(userId);

            let filePath = path.join(__dirname, `./../data/images/${img.filename}`);
            decodingBase64(img.imgFile, filePath);
            
            const newBook = new BookModel({
                img: `/api/files/${img.filename}`,
                title,
                description,
                price,
                descount: descount || 0,
                rating: 0,
                author,
                year,
                genre,
                publisher: user.username,
                ISBN: ISBN || null,
                language,
                bookFormat: bookFormat || null,
                datePublished: formatDate('mm/dd/yyyy', today),
                tags: tags || []
            });
            // newBook.tags.push('friend');

            try {
                await newBook.save();
                res.status(201).send({
                    message: 'Book has been saved'
                })
            } catch (error) {
                // console.log(error.errors.img.message)
                // console.log(error.message)
                throw error.message;
            }
        }
    }
}

async function getBook(req, res) {
    const { title } = req.body;
    if (!title) {
        res.staatus(400).send({ message: "bad request. Please check body and try again" })
    } else {
        const bookExists = await BookModel.findOne({ title });
        if (!bookExists) res.status(404).send({ message: `${title} has not found` });
        else {
            res.send(bookExists);
        }
    }
}
async function getBooks(req, res) {
    try {
        const bookExists = await BookModel.find();
        res.send(bookExists);
    } catch (e) {
        console.log(e)
    }
}

async function deleteBook(req, res) {
    const { id } = req.params;
    let book = await BookModel.findByIdAndDelete(id);
    if (!book) res.status(404).send({ message: "a Book not found" });
    else {
        let filePath = path.join(__dirname, `./../data/images/${book.img.replace('/api/files/', '')}`);
        let file = await unlink(filePath);
        res.send({ message: "a Book has been deleted"});
    }
}

async function updateBook(req, res) {
    const { id } = req.params;
    const bookExists = await BookModel.findById(id);
    if (!bookExists) res.status(404).send({ messaage: "a Book not found" });
    else {
        const { img, title, description, price, descount, rating, author, year, genre, ISBN, language, bookFormat, tags } = req.body;
        
        const bookUpdate = await BookModel.findOneAndUpdate({ _id: id }, {
            title: title || bookExists.title,
            description: description || bookExists.description,
            price: price || bookExists.price,
            descount: descount || bookExists.descount,
            author: author || bookExists.author,
            year: year || bookExists.year,
            genre: genre || bookExists.genre,
            ISBN: ISBN || bookExists.ISBN,
            language: language || bookExists.language,
            bookFormat: bookFormat || bookExists.bookFormat,
            tags: tags || bookExists.tags,
        });
        res.send({ message: "This book has been updated" });
    }
}
module.exports = {
    createBook,
    getBook,
    getBooks,
    deleteBook,
    updateBook
}