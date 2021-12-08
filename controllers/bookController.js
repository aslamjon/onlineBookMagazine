// const _ = require('lodash');
const path = require("path");
const { BookModel } = require("../models/bookModel");
const { UserModel } = require("../models/userModel");
const { decodingBase64, formatDate, unlink, getTime, logger, ISODate, setYear } = require("../utiles");

async function createBook(req, res) {
    const { img, title, description, price, descount, author, year, genre, ISBN, language, bookFormat, tags } = req.body;

    
    if ( !title || !description || !price || !author || !year || !genre || !language) res.status(400).send({ message: "Bad request" });
    else if (!Array.isArray(genre)) res.status(400).send({ message: "Bad request: Plase send 'genre' in Array" });
    else if (!img) res.status(400).send({ message: "Bad request: Please send img" })
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
                    datePublished: formatDate("mm/dd/yyyy"),
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
            logger(`IN CREATE_BOOK: ${e.message}`, { status: 'ERROR', res });
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
            logger(`IN GET_BOOK: ${e.message}`, { status: 'ERROR', res });
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
        logger(`IN GET_BOOKS: ${e.message}`, { status: 'ERROR', res });
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
        logger(`IN TOGGLE_BOOK: ${e.message}`, { status: 'ERROR', res });
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
        let messages = [];
        if (!newest && !date && !category && !editorPicks && !publisher && !yearRange && !priceRange) res.status(400).send({ message: "Bad request" });
        else {
            if (Boolean(newest)) newest = -1;
            else newest = 1;

            let now = new Date();
            let dayMilliseconds = 86400000;

            options.$expr = {$and: []};

            if (Object.keys(yearRange).length && yearRange.min <= yearRange.max) 
                options.$expr = {
                    $and: [
                        { $gte: ["$year", String(yearRange.min)] }, 
                        { $lte: ["$year", String(yearRange.max)] }
                    ]
                };

            else messages.push("ERROR: yearRange. Please check payload");
            
            if (priceRange.min <= priceRange.max) options.$expr.$and.push({ $gte: ["$price", priceRange.min] }, { $lte: ["$price", priceRange.max] });
            else messages.push("ERROR: PriceRange. Please check payload");
            
            if (date.toLowerCase() == 'today') options.$expr.$and.push({ $gte: ["$datePublished", formatDate('mm/dd/yyyy')] });
            else if (date.toLowerCase() == 'week') options.$expr.$and.push({ $gte: ["$datePublished", formatDate('mm/dd/yyyy', new Date(now.valueOf()-(7*dayMilliseconds)))] });
            else if (date.toLowerCase() == 'month') options.$expr.$and.push({ $gte: ["$datePublished", formatDate('mm/dd/yyyy', new Date(now.valueOf()-(30*dayMilliseconds)))] });
            else if (date.toLowerCase() == 'year') options.$expr.$and.push({ $gte: ["$datePublished", formatDate('mm/dd/yyyy', new Date(now.valueOf()-(365*dayMilliseconds)))] });
            
            if (Array.isArray(category)) options.genre = { $all: category };
            else messages.push("Please send category as array");

            if (typeof publisher == 'string') options.publisher = publisher;
            else messages.push("Please send publisher on the string");

            if (skip <= limit) {
                bookExists.results = await BookModel.find(options).sort({ datePublished: newest, timePublished: newest }).skip(skip).limit(limit);
                bookExists.count = await BookModel.find(options).count();
            } else {
                bookExists.results = await BookModel.find(options).sort({ datePublished: newest, timePublished: newest });
            }
            res.send({ results: bookExists.results, errors: messages, count: bookExists.count ? bookExists.count : null });
        }
    } catch (e) {
        logger(`IN FILTER_BOOK: ${e.message}`, { status: 'ERROR', res });
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
        logger(`IN DELETE_BOOK: ${e.message}`, { status: 'ERROR', res });
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
        logger(`IN UPDATE_BOOK: ${e.message}`, { status: 'ERROR', res });
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
        logger(`IN BOOK_FOR_LANDING_PAGE: ${e.message}`, { status: 'ERROR', res });
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