// Models imports
const Todo = require('../database/models/todo.model')
const Collection = require('../database/models/todoCollection.model')
const User = require('../database/models/user.model')

// Utils imports
const Joi = require('joi')

//------------------------------------------------------------------ Utils

const validationSchema = Joi.object({
    name: Joi.string().required()
})

//------------------------------------------------------------------ Req Res functions

//--------------------------------------- Users collections

/**
 * Get all the collection from a user
 */
exports.getAllCollections = async (req, res)=>{
    try{

        // Get the user from the params id
        const user = await User.findOne({_id: req.user._id})
        if(!user) return res.status(400).json({ok:false, message: "There is no user with this ID"})

        // Initate the collections array
        const collections = new Array;

        // Get all the collections of the user and push them to the collections array
        for(const collection of user.collections){
            collections.push(await Collection.findOne({_id: collection}))
        }

        // Send in json the filled collections array
        res.json({ok: true, data: collections})

    }catch(err){
        res.status(400).json({ok: false, message: err.message})
    }
}

/**
 * Add a new collection in the collections of a user
 */
exports.addCollectionToUser = async (req, res)=>{
    try{

        // Get the user collections
        const user = await User.findOne({_id: req.user._id})
        const userCollection = user.collections

        // Check if the req.body is ok
        const validation = validationSchema.validate(req.body)
        if(validation.error) return res.status(400).json({ok:false, message: validation.error.details[0].message})

        // Create a new collection with data
        const newCollection = new Collection({
            name: validation.value.name
        })

        // Save the new collection
        const savedCollection = await newCollection.save()

        // Add the collection to the collections list into the user
        userCollection.push(savedCollection._id)

        await User.findOneAndUpdate(
            {_id: req.user._id},
            {
                $set: {
                    collections: userCollection
                }
            }
        )

        res.status(200).json({ok:true, data: savedCollection})

    }catch(err){
        res.status(400).json(err.message)
    }
}

/**
 * Delete a collection specified in req.body.collection to a user from req.user._id
 */
exports.deleteCollectionOfUser = async (req, res)=>{
    try{

        // Get the user collections
        const user = await User.findOne({_id: req.user._id})
        const userCollections = user.collections

        // Find the collection
        let collectionToDelete = userCollections.find((collection)=>{
            return collection._id == req.body.collection
        })

        // Get the whole collection
        collectionToDelete = await Collection.findOne({_id: collectionToDelete})
        if(!collectionToDelete) return res.status(400).json({ok: false, message: "This collection doesn't exist"})

        // Remove all the todos in the collection
        const removedTodos = new Array()
        for(const todo of collectionToDelete.todos){
            const removedTodo = await Todo.findOneAndRemove({_id:todo})
            removedTodos.push(removedTodo)
        }
        
        // Delete the collection form the user and from the db
        userCollections.splice(userCollections.indexOf(collectionToDelete._id), 1)
        const deletedCollection = await Collection.findOneAndRemove({_id: collectionToDelete._id})

        // Update the user
        const updateUser = await User.findOneAndUpdate(
            {_id: user._id},
            {
                $set:{
                    collections: userCollections
                }
            }
        )

        const updatedUser = await User.findOne({_id: updateUser._id})

        // Send the response
        res.status(200).json({ok: true, user: updatedUser, deletedCollection})

    }catch(err){
        res.status(400).json({ok:false, message: err.message})
    }
}

//--------------------------------------- Collection

/**
 * Get all todos inside of a collection
 */
exports.getAllTodosFromACollection = async (req, res)=>{
    try{
        
        // Get the collection
        const collection = await Collection.findOne({_id: req.params.id})

        // Get all plain todos
        const todos = new Array()
        for(const todoId of collection.todos){
            todos.push(await Todo.findOne({_id: todoId}))
        }

        // Send in the response all todos
        res.status(200).json({ok: true, data: todos})

    }catch(err){
        res.status(400).json({ok:false, message: err.message})
    }
}

//--------------------------------------- Todo

/**
 * Add a todo inside of a specified collection
 */
exports.addTodoInCollection = async (req, res)=>{
    try{

        // Check the req.body data
        const validation = validationSchema.validate(req.body)
        if(validation.error) return res.status(400).json({ok: false, message: validation.error.details[0].message})

        // Create a new todo
        const newTodo = new Todo({
            name: validation.value.name,
            parentCollection: req.params.id
        })

        // Save the new todo
        const savedTodo =  await newTodo.save()

        // Get the collection todos
        const collection = await Collection.findOne({_id: req.params.id})
        const collectionTodos = collection.todos

        // Save to collection the new todo id
        collectionTodos.push(savedTodo._id)
        const updateCollection = await Collection.findOneAndUpdate(
            {_id: req.params.id},
            {
                $set:{
                    todos: collectionTodos
                }
            }
        )

        const updatedCollection = await Collection.findOne({_id: updateCollection._id})

        // Send the response
        res.status(201).json({ok: true, data: updatedCollection})

    }catch(err){
        res.status(400).json({ok: false, message: err.message})
    }
}

/**
 * Mutate the state of the todo
 */
exports.mutateTodoState = async (req, res)=>{
    try{

        const todo = await Todo.findOne({_id: req.params.id})

        const updateTodo = await Todo.findOneAndUpdate(
            {_id: todo._id},
            {
                $set:{
                    done: !todo.done
                }
            }
        )

        res.status(200).json({ok: true, data: {id: todo._id, mutateTo: !todo.done}})

    }catch(err){
        res.status(400).json({ok: false, message: err.message})
    }
}

/**
 * Delete a todo
 */
exports.deleteTodo = async (req, res)=>{
    try{

        const deletedTodo = await Todo.findOneAndRemove({_id: req.params.id})

        const collection = await Collection.findOne({_id: deletedTodo.parentCollection})
        const collectionTodos = collection.todos

        collectionTodos.splice(collectionTodos.indexOf(deletedTodo._id), 1)

        const updateCollection = await Collection.findOneAndUpdate(
            {_id: collection._id},
            {
                $set:{
                    todos: collectionTodos
                }
            }
        )

        const updatedCollection = await Collection.findOne({_id: updateCollection._id})
        
        res.status(200).json({ok: true, data:{
            deletedTodo,
            updatedCollection
        }})

    }catch(err){
        res.status(400).json({ok:false, message: err.message})
    }
}