const { Types } = require('mongoose');
const { CardModel } = require('./../models/cardModel');
const { BookModel } = require("../models/bookModel");
const { formatDate, getTime, logger } = require("../utiles");

async function createCard(req, res) {
    try {
        const { productId, quantity } = req.body;
        const isHave = await BookModel.findById(productId);
        if (!productId || !quantity) res.status(400).send({ message: "Bad request" });
        else if (!isHave) res.status(404).send({ message: "Product not found" });
        else {
            const newCard = await CardModel({
                productId: Types.ObjectId(productId),
                userId: req.user.userId,
                quantity,
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

async function deleteCard(req, res) {
    try {
        const {id} = req.params;
        const cardExists = await CardModel.findByIdAndDelete(id);
        if (!cardExists) res.status(404).send({ message: "Card not found" });
        else res.send({ message: "Card has been deleted" });
    } catch (e) {
        logger(`IN DELETE_CARD: ${e.message}`, { status: "ERROR", res });
    }
}

async function updateCard(req, res) {
    try {
        const {id} = req.params;
        const cardExists = await CardModel.findById(id);
        if (!cardExists) res.status(404).send({ messaage: "Card not found" });
        else {
            const { quantity } = req.body;
            const bookUpdate = await CardModel.findOneAndUpdate({ _id: id }, {
                quantity: quantity || cardExists.quantity
            });
            res.send({ message: "Card has been updated" });
        }
    } catch (e) {
        logger(`IN UPDATE_CARD: ${e.message}`, { status: "ERROR", res });
    }
}


// .populate('books.$*.author');

module.exports = {
    createCard,
    getCard,
    deleteCard,
    updateCard
}