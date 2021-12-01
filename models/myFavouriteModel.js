const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    user_id: {
        type: Types.ObjectId,
        required: 'UserID is required',
        unique: true
    },
    book_id: {
        type: Types.ObjectId,
        required: 'BookID is required',
        unique: true
    },
});

module.exports = {
    FavouriteModel: model('Favourite', schema)
}