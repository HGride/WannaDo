const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        require: [true, "User need a name to be created"]
    },
    email: {
        type: String,
        require: [true, "User need an email to be created"],
        unique: [true, "User email already exist"]
    },
    password: {
        type: String,
        require: [true, "User need a password to be created"]
    },
    collections: {
        type: Array,
        default: []
    },
    auth: {
        type: Array,
        default: ['normal']
    }
}, {timestamps: true})

module.exports = mongoose.model('user', userSchema)