const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    userId: {
        type: Types.ObjectId
    },
    discount_percent: {
        type: Number,
        required: "Discount Percent is required"
    },
    active: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: String,
        default: ''
    },
    modifiedAt: {
        type: String,
        default: ''
    },
})

module.exports = {
    DiscountModel: model('Discount', schema),
}