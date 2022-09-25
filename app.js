// Imports
const express = require('express')
const cors = require('cors')
const Router = require('./routes/index.routes')
const DB = require('./database/setup.db')

// Read environnement variables
require('dotenv').config()

// Create an app
const app = express()

// Body-parser and cors
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

// Serve public files
app.use(express.static('public'));

// Router
app.use(Router)

//Start the app and connect to the DB
DB.initateDB(process.env.__dbURI)
.then(()=>{
    app.listen(process.env.__port, ()=>{
        console.info(`🏆 Server started at: http://localhost:${process.env.__port}/`)
    })
})
.finally(()=>{
    console.info(`📃 MongoDB connected to ${process.env.__pubDbURI}`)
})