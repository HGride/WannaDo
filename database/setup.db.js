const mongoose = require('mongoose')

exports.initateDB = async (uri)=>{
    return await mongoose.connect(uri)
}