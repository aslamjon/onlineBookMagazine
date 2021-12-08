const { Schema, Types } = require('mongoose');
const { CommentModel } = require('./../models/commentModel')
const { formatDate, unlink, getTime, logger, ISODate, setYear } = require("../utiles");

async function createComment(req, res) {
    try {
        const {comment, rating, commentFor} = req.body;
        const isHave = await BookModel.findById(commentFor);
        if (!comment || !rating || typeof rating !== 'number' || !commentFor) req.status(400).send({ message: "Bad request" });
        else if (!isHave) res.status(404).send({ message: "Product not found" });
        else {
            const newComment = await CommentModel({
                commentFor: Types.ObjectId(commentFor),
                comment,
                rating,
                postRefId: req.user.userId,
                createdAt: formatDate("mm/dd/yyyy"),
                createdTime: getTime(24)
            });
            await newComment.save();
            res.status(201).send({
                message: 'Comment has been saved'
            })
        }
    } catch (e) {
        logger(`IN CREATE_COMMENT: ${e.message}`, { status: "ERROR", res });
    }
}

async function getComment(req, res) {
    try {
        let { skip, limit, newest, id } = req.query;

        skip = Number(skip);
        limit = Number(limit);
        Boolean(newest) ? newest = -1 : newest = 1;

        let commentExists = {};
        if (skip <= limit) {
            commentExists.results = await CommentModel.find(id ? { commentFor: Types.ObjectId(id) } : null).sort({ createdAt: newest, createdTime: newest }).populate({ path: 'postRefId', select: 'username'}).skip(skip).limit(limit);
            commentExists.count = await CommentModel.find(id ? { commentFor: Types.ObjectId(id) } : null).count();
        } else {
            commentExists.results = await CommentModel.find(id ? { commentFor: Types.ObjectId(id) } : null).sort({ createdAt: newest, createdTime: newest }).populate({ path: 'postRefId', select: 'username'});
        }
        res.send({ results: commentExists.results, count: commentExists.count ? commentExists.count : null });
    } catch (e) {
        logger(`IN GET_COMMENT: ${e.message}`, { status: "ERROR", res });
    }
}


// .populate('books.$*.author');

module.exports = {
    createComment,
    getComment
}