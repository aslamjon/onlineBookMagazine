// const _ = require('lodash');
const path = require("path");
const { BookModel } = require("../models/bookModel");
const { UserModel } = require("../models/userModel");
const { decodingBase64, formatDate, unlink, getTime, logger } = require("../utiles");

async function createBook(req, res) {
    const { img, title, description, price, descount, author, year, genre, ISBN, language, bookFormat, tags } = req.body;

    const today = new Date();
    
    if ( !title || !description || !price || !author || !year || !genre || !language) res.status(400).send({ message: "Bad request" });
    else if (!img) {
        res.status(400).send({ message: "Bad request" })
    }
    else {
        try {
            const bookExists = await BookModel.findOne({ title });
    
            if (bookExists) {
                res.status(400).send({ message: "This book is already exists" });
            } else {
                const { userId } = req.user;
                const user = await UserModel.findById(userId);
    
                let filePath = path.join(__dirname, `./../data/images/${img.filename}`);
                decodingBase64(img.imgFile, filePath);
                
                const newBook = new BookModel({
                    img: `/api/files/images/${img.filename}`,
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
                    timePublished: getTime(24),
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
        } catch (e) {
            logger(`IN CREATE_BOOK: ${e.message}`, 'ERROR');
        }
    }
}

async function getBook(req, res) {
    const { title } = req.body;
    if (!title) {
        res.staatus(400).send({ message: "bad request. Please check body and try again" })
    } else {
        try {
            const bookExists = await BookModel.findOne({ title });
            if (!bookExists) res.status(404).send({ message: `${title} has not found` });
            else {
                res.send(bookExists);
            }
        } catch (e) {
            logger(`IN GET_BOOK: ${e.message}`, 'ERROR');
        }
    }
}

async function getBooks(req, res) {
    try {
        let { skip, limit } = req.query;
        skip = Number(skip);
        limit = Number(limit);
        let bookExists = {};
        if (skip <= limit) {
            bookExists.results = await BookModel.find().skip(skip).limit(limit);
            bookExists.count = await BookModel.find().count();
        } else {
            bookExists = await BookModel.find();
        }
        res.send(bookExists);
    } catch (e) {
        logger(`IN GET_BOOKS: ${e.message}`, 'ERROR');
    }
}

async function toggleFavourite(req, res) {
    try {
        const { bookId } = req.body;
        const { userId } = req.user;
        const bookExists = await BookModel.findById(bookId);
        const user = await UserModel.findById(userId);

        if (!bookId) res.status(400).send({ message: "Bad request. Please enter book's id and try again" });
        else if (!bookExists) res.status(404).send({ message: "Book not found" });
        else if (user.favourite[bookId]) {
            delete user.favourite[bookId];
            const update = await UserModel.findOneAndUpdate({_id: userId}, {...user});
            res.send({ message: "Favourite has been deleted" });
        }
        else {
            const update = await UserModel.findOneAndUpdate({_id: userId}, {
                username: user.username,
                email: user.email,
                password: user.password,
                role: user.role,
                favourite: {
                    ...user.favourite,
                    [bookId]: bookExists.title
                }
            });
            res.send({ message: "Favourite has been created" });
        }
    } catch (e) {
        logger(`IN TOGGLE_BOOK: ${e.message}`, 'ERROR');
    }
}

async function filterBook(req, res) {
    try {
        let { skip, limit } = req.query;
        skip = Number(skip);
        limit = Number(limit);
        let { newest, date, category, editorPicks, publisher, yearRange, priceRange } = req.body;
        let bookExists = {};
        let options = {};
        if (!newest && !date && !category && !editorPicks && !publisher && !yearRange && !priceRange) res.status(400).send({ message: "Bad request" });
        else {
            if (Boolean(newest)) newest = -1;
            else newest = 1
            if (date.split("/").length == 3) options.datePublished = { $gte: date };
            // keep on

            if (skip <= limit) {
                bookExists.results = await BookModel.find().skip(skip).limit(limit);
                bookExists.count = await BookModel.find().count();
            } else {
                bookExists = await BookModel.find();
            }
            res.send({  })
        }
    } catch (e) {
        logger(`IN FILTER_BOOK: ${e.message}`, 'ERROR');
    }
}

async function deleteBook(req, res) {
    try {
        const { id } = req.params;
        let book = await BookModel.findByIdAndDelete(id);
        if (!book) res.status(404).send({ message: "a Book not found" });
        else {
            let filePath = path.join(__dirname, `./../data/${book.img.replace('/api/files/', '')}`);
            let file = await unlink(filePath);
            res.send({ message: "a Book has been deleted"});
        }
    } catch (e) {
        logger(`IN DELETE_BOOK: ${e.message}`, 'ERROR');
    }
}

async function updateBook(req, res) {
    try {
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
    } catch (e) {
        logger(`IN UPDATE_BOOK: ${e.message}`, 'ERROR');
    }
}

async function bookForLandingPage(req, res) {
    try {
        const popular = await BookModel.find({},{title:1, img:1, publisher:1}).sort({ bestSelling: -1 }).limit(10);
        const recommended = await BookModel.find({},{title:1, img:1, publisher:1, genre:1, price:1, discount:1}).sort({ bestSelling: -1, rating: -1 }).limit(10);
        const users = await UserModel.find().count();
        const books = await BookModel.find().count();
        res.send({ popular, recommended, users, books, audioBook: 0, stories: 0 });
    } catch (e) {
        logger(`IN BOOK_FOR_LANDING_PAGE: ${e.message}`, 'ERROR');
    }
}
module.exports = {
    createBook,
    getBook,
    getBooks,
    deleteBook,
    updateBook,
    bookForLandingPage,
    filterBook,
    toggleFavourite
}