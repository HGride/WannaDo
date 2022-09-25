const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoCollectionSchema = new Schema({
    name: {
        type: String,
        require: [true, "To create a collection you need to specify a name"]
    },
    todos: {
        type: Array,
        default: []
    },
    color: {
        type: String,
        default: "#DDE1E4"
    }
},{timestamps: true})

module.exports = mongoose.model('todosCollection', todoCollectionSchema)