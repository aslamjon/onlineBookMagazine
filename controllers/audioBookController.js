const path = require("path");
const { AudioBookModel } = require("../models/audioBookModel");
const { UserModel } = require("../models/userModel");
const { decodingBase64, formatDate, unlink, getTime } = require("../utiles");

async function createAudioBook(req, res) {
    const { img, audio, title, description, price, descount, author, year, genre, ISBN, language, bookFormat, tags } = req.body;

    let audioFileFormat = audio.filename.split('.').pop();
    const bookExists = await AudioBookModel.findOne({ title: title });
    if ( !img.imgFile || !audio.audioFile || !title || !description || !price || !author || !year || !genre || !language) res.status(400).send({ message: "Bad request" })
    else if (bookExists) res.status(400).send({ message: "This book is already exists" });
    else if (audioFileFormat !== 'mp3') res.status(400).send({ message: `${audioFileFormat} format is not allowed. Please send only mp3 audio format for audio book` })
    else {
            const { userId } = req.user;
            const user = await UserModel.findById(userId);

            let imgPath = path.join(__dirname, `./../data/images/${img.filename}`);
            let audioPath = path.join(__dirname, `./../data/audios/${audio.filename}`);
            decodingBase64(img.imgFile, imgPath);
            decodingBase64(audio.audioFile, audioPath);
            
            const newBook = new AudioBookModel({
                img: `/api/files/images/${img.filename}`,
                audio: `/api/files/audios/${audio.filename}`,
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
                datePublished: formatDate('mm/dd/yyyy'),
                timePublished: getTime(24),
                tags: tags || []
            });
            // newBook.tags.push('friend');
            try {
                await newBook.save();
                res.status(201).send({
                    message: 'AudioBook has been saved'
                })
            } catch (error) {
                // console.log(error.errors.img.message)
                // console.log(error.message)
                throw error.message;
            }
    }
}

async function getAudioBook(req, res) {
    const { title } = req.body;
    const bookExists = await AudioBookModel.findOne({ title });
    if (!title) res.staatus(400).send({ message: "bad request. Please check body and try again" })
    else if (!bookExists) res.status(404).send({ message: `${title} has not found` });
    else {
        res.send(bookExists);
    }
}
async function getAudioBooks(req, res) {
    try {
        let { skip, limit } = req.query;
        skip = Number(skip);
        limit = Number(limit);
        let bookExists = {};
        if (skip <= limit) {
            bookExists.results = await AudioBookModel.find().skip(skip).limit(limit);
            bookExists.count = await AudioBookModel.find().count();
        } else {
            bookExists = await AudioBookModel.find();
        }
        res.send(bookExists);
    } catch (e) {
        console.log(e)
    }
}

async function toggleFavourite(req, res) {
    try {
        const { audioBookId } = req.body;
        const { userId } = req.user;
        const bookExists = await AudioBookModel.findById(audioBookId);
        const user = await UserModel.findById(userId);

        if (!audioBookId) res.status(400).send({ message: "Bad request. Please enter audio book's id and try again" });
        else if (!bookExists) res.status(404).send({ message: "Audio Book not found" });
        else if (user.favourite[audioBookId]) {
            delete user.favourite[audioBookId];
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
                    [audioBookId]: bookExists.title
                }
            });
            res.send({ message: "Favourite has been created" });
        }
    } catch (e) {
        console.log(e)
    }
}


async function deleteAudioBook(req, res) {
    const { id } = req.params;
    let book = await AudioBookModel.findByIdAndDelete(id);
    if (!book) res.status(404).send({ message: "a Audio Book not found" });
    else {
        let filePath = path.join(__dirname, `./../data/images/${book.img.replace('/api/files/', '')}`);
        let audioFilePath = path.join(__dirname, `./../data/audios/${book.audio.replace('/api/files/', '')}`);
        let file1 = await unlink(filePath);
        let file2 = await unlink(audioFilePath);
        res.send({ message: "a Audio Book has been deleted"});
    }
}

async function updateAudioBook(req, res) {
    const { id } = req.params;
    const bookExists = await AudioBookModel.findById(id);
    if (!bookExists) res.status(404).send({ messaage: "a Audio Book not found" });
    else {
        const { img, title, description, price, descount, rating, author, year, genre, ISBN, language, bookFormat, tags } = req.body;
        
        const bookUpdate = await AudioBookModel.findOneAndUpdate({ _id: id }, {
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
        res.send({ message: "This audio book has been updated" });
    }
}

module.exports = {
    createAudioBook,
    getAudioBook,
    getAudioBooks,
    deleteAudioBook,
    updateAudioBook,
    toggleFavourite
}