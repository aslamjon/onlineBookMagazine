const { Schema, model, Types } = require('mongoose');



const schema = new Schema({
    img: {
        type: String,
        required: 'Image is required'
    },
    audio: {
        type: String,
        required: 'File is required'
    },
    title: {
        type: String,
        required: 'Title is required',
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: 'Description is required'
    },
    price: {
        type: Number,
        required: 'Price is required'
    },
    discount: {
        type: Number
    },
    rating: {
        type: Number,
        required: 'Rating is required',
        default: 0
    },
    author: {
        type: String,
        required: 'Author is required'
    },
    year: {
        type: Number,
        required: 'Year is required'
    },
    genre: {
        type: String,
        required: 'Genre is required'
    },
    publisher: {
        type: String,
        required: 'publisher is required'
    },
    ISBN: {
        type: String
    },
    language: {
        type: String,
        required: 'Language is required'
    },
    bookFormat: {
        type: String
    },
    datePublished: {
        type: String,
        required: 'DatePublished is required'
    },
    tags: [String],
    bestSelling: {
        type: Number,
        defualt: 0
    },
    
})

module.exports = {
    AudioBookModel: model('AudioBook', schema)
}