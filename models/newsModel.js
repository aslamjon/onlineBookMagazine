const { Schema, model, Types } = require('mongoose');



const schema = new Schema({
    img: {
        type: String,
        required: 'Image is required'
    },
    title: {
        type: String,
        required: 'Title is required',
        // unique: true,
        // lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: 'Description is required'
    },
    publisher: {
        type: String,
        required: 'publisher is required'
    },
    datePublished: {
        type: String,
        required: 'DatePublished is required'
    },
})

module.exports = {
    NewsModel: model('News', schema)
}