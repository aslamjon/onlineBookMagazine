const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    productId: {
        type: Types.ObjectId,
        ref: "Book",
    },
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: 'UserId is required'
    },
    quantity: {
        type: Number,
        default: 1
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
    CardModel: model('Card', schema)
}