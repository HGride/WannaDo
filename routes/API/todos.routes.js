const todosRouter = require('express').Router()
const todosController = require('../../controllers/todos.controller')
const authController = require('../../controllers/auth.controller')

todosRouter.route('/users')
    .get(authController.authToken, todosController.getAllCollections)
    .post(authController.authToken, todosController.addCollectionToUser)
    .delete(authController.authToken, todosController.deleteCollectionOfUser)

todosRouter.route('/todo/:id')
    .get(authController.authToken, todosController.getAllTodosFromACollection)
    .post(authController.authToken, todosController.addTodoInCollection)
    .patch(authController.authToken, todosController.mutateTodoState)
    .delete(authController.authToken, todosController.deleteTodo)


module.exports = todosRouter