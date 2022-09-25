const apiRouter = require('express').Router()
const apiController = require('../../controllers/api.controller')
const authController = require('../../controllers/auth.controller')

// Routers
const userRoutes = require('./users.routes')
const todosRoutes = require('./todos.routes')
const authRoutes = require('./auth.routes')

apiRouter.use('/users', userRoutes)
apiRouter.use('/collections', todosRoutes)
apiRouter.use('/auth', authRoutes)

apiRouter.route('/')
    .get(authController.adminAuthToken, apiController.home)

module.exports = apiRouter