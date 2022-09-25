const userRouter = require('express').Router()
const userController = require('../../controllers/user.controller')
const authController = require('../../controllers/auth.controller')

// /api/users
userRouter.route('/')
    .get(authController.adminAuthToken, userController.getAll)
    .post(userController.createNew)

// /api/users/me
userRouter.route('/me')
    .get(authController.authToken, userController.getOne)
    .patch(authController.authToken, userController.updateOne)
    .delete(authController.authToken, userController.deleteOne)

module.exports = userRouter