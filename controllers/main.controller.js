const path = require('path')

exports.index = (req, res)=>{
    res.sendFile(path.join(__dirname, '../views/index.html'))
}

exports.notFound = (req, res)=>{
    res.status(404).sendFile(path.join(__dirname, '../views/404.html'))
}