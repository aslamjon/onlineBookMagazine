const { Schema, Types } = require('mongoose');
const { CardModel } = require('./../models/cardModel');
const { BookModel } = require("../models/bookModel");
const { formatDate, unlink, getTime, logger, ISODate, setYear } = require("../utiles");

async function createCard(req, res) {
    try {
        const { productId } = req.body;
        const isHave = await BookModel.findById(productId);
        if (!productId) res.status(400).send({ message: "Bad request" });
        else if (!isHave) res.status(404).send({ message: "Product not found" });
        else {
            const newCard = await CardModel({
                productId: Types.ObjectId(productId),
                userId: req.user.userId,
                createdAt: formatDate("mm/dd/yyyy"),
                createdTime: getTime(24)
            });
            await newCard.save();
            res.status(201).send({
                message: 'Card has been saved'
            })
        }
    } catch (e) {
        logger(`IN CREATE_CARD: ${e.message}`, { status: "ERROR", res });
    }
}

async function getCard(req, res) {
    try {
        let { skip, limit, newest, id } = req.query;

        skip = Number(skip);
        limit = Number(limit);
        Boolean(newest) ? newest = -1 : newest = 1;

        let cardExsists = {};
        if (skip <= limit) {
            cardExsists.results = await CardModel.find(id ? { userId: Types.ObjectId(id) } : null).sort({ createdAt: newest, createdTime: newest }).populate({ path: 'productId', select: 'title'}).skip(skip).limit(limit);
            cardExsists.count = await CardModel.find(id ? { userId: Types.ObjectId(id) } : null).count();
        } else {
            cardExsists.results = await CardModel.find(id ? { userId: Types.ObjectId(id) } : null).sort({ createdAt: newest, createdTime: newest }).populate({ path: 'productId', select: 'title'});
        }
        res.send({ results: cardExsists.results, count: cardExsists.count ? cardExsists.count : null });
    } catch (e) {
        logger(`IN GET_CARD: ${e.message}`, { status: "ERROR", res });
    }
}


// .populate('books.$*.author');

module.exports = {
    createCard,
    getCard
}