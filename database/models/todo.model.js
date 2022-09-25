const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
    name: {
        type: String,
        required: [true, "Todo need a name to be created"]
    },
    done: {
        type: Boolean,
        default: false
    },
    parentCollection: {
        type: Object,
        required: [true, "Todo need a collection to come from"]
    }
},{timestamps: true})

module.exports = mongoose.model('todo', todoSchema)