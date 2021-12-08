const { Schema, model, Types } = require('mongoose');



const schema = new Schema({
    commentFor: {
        type: Types.ObjectId,
        ref: "Book",
    },
    comment: {
        type: String,
        required: 'Comment is required'
    },
    rating: {
        type: Number,
        required: 'Rating is required',
        default: 0
    },
    postRefId: {
        type: Types.ObjectId,
        ref: "User",
        required: 'PostRefId is required'
    },
    createdAt: {
        type: String,
        required: 'CreatedAt is required'
    },
    createdTime: {
        type: String,
        required: 'createdTime is required'
    }
})

module.exports = {
    CommentModel: model('Comment', schema)
}