const path = require("path");
const { UserModel } = require("../models/userModel");
const { NewsModel } = require("../models/newsModel");
const { formatDate, decodingBase64, unlink } = require("../utiles");

async function createNews(req, res) {
    try{
        const { img, title, description } = req.body;
        const { userId } = req.user;
        let imgFileFormat = img.filename.split('.').pop();
        if (!img.imgFile || !title || !description ) res.status(400).send({ message: "Bad request" });
        else if (imgFileFormat !== 'jpg' && imgFileFormat !== 'png') res.status(400).send({ message: `${imgFileFormat} is not allowed. Please send only jpg and png format` });
        else {
            const user = await UserModel.findById(userId);

            let imgPath = path.join(__dirname, `./../data/images/${img.filename}`);
            decodingBase64(img.imgFile, imgPath);
            const newNews = await NewsModel({
                img: `/api/files/images/${img.filename}`,
                title,
                description,
                publisher: user.username,
                datePublished: formatDate('mm/dd/yyyy'),
            });
            try {
                await newNews.save();
                res.status(201).send({ message: 'News has been saved' });
            } catch (error) {
                throw error.message;
            }
        }
    } catch (e) {
        console.log(e);
    }
}

async function getNews(req, res) {
    try {
        const news = await NewsModel.find();
        res.send(news);
    } catch (e) {
        console.log(e);
    }
}

async function deleteNews(req, res) {
    try {
        const { id } = req.params;
        const news = await NewsModel.findByIdAndDelete(id);
        if (!news) res.status(404).send({ message: "News not found" });
        else {
            let filePath = path.join(__dirname, `./../data/images/${news.img.replace('/api/files/images/', '')}`);
            let file1 = await unlink(filePath);
            res.send({ message: "News has been deleted"});
        }
    } catch (e) {
        console.log(e);
    }
}

async function updateNews(req, res) {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const { userId } = req.user;
        const news = await NewsModel.findById(id);
        const user = await UserModel.findById(userId);
        if (!news) res.status(404).send({ message: "News not found" });
        else if (user.username !== news.publisher) res.send({ message: "You can't access here"});
        else {
            const newsUpdate = await NewsModel.findOneAndUpdate({ _id: id }, {
                title: title || news.title,
                description: description || news.description,
            });
            res.send({ message: "News has been updated" });
        }
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    createNews,
    getNews,
    deleteNews,
    updateNews
}