const authRouter = require('express').Router()
const authController = require('../../controllers/auth.controller')

authRouter.route('/login')
    .post(authController.login)

authRouter.route('/token/refresh')
    .post(authController.refreshToken)

module.exports = authRouter