const Router = require('express').Router()

// Controllers
const mainController = require('../controllers/main.controller')

//Routes
const apiRoutes = require('./API/api.routes')

// Bases routes
Router.route('/')
.get(mainController.index)

// Api
Router.use('/api', apiRoutes)

// 404 handeler
Router.all('/*', mainController.notFound)

module.exports = Router