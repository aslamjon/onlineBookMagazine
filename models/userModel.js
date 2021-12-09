const { Schema, model, Types } = require('mongoose');

const validateEmail = function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const schema = new Schema({
    username: {
        type: String,
        required: 'Username is required',
        unique: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: 'Password is required'
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    favourite: Schema.Types.Mixed,
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    phoneNumber: {
        type: String,
        default: ''
    },
})

const schemaBlackList = new Schema({
    username: {
        type: String,
        required: 'Username is required',
        unique: true
    }
})

module.exports = {
    UserModel: model('User', schema),
    UserBlakListModel: model('UserBlakList', schemaBlackList)
}