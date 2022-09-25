// Import User model
const User = require('../database/models/user.model')

// Imports
const Joi = require('joi')
const bcrypt = require('bcrypt')

//------------------------------------------------------------------ Utils

const validationSchema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(8).max(255).pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,)).required(),
    auth: Joi.array().min(1).max(255)
})

const updateValidationSchema = Joi.object({
    name: Joi.string().min(2).max(255),
    email: Joi.string().email().max(255),
    password: Joi.string().min(8).max(255).pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,))
})

//------------------------------------------------------------------ Req Res functions

/**
 * Get all users
 * @param {Object} req The request 
 * @param {Object} res The res to send
 */
exports.getAll = async (req, res)=>{
    try{
        const users = await User.find({})
        res.json({
            ok: true,
            data: users
        })
    }catch(err){
        res.status(400).json({
            ok: false,
            message: err.message
        })
    }
}

/**
 * Create a new user following the req.body {name: String, email: String, password: String}
 * @param {Object} req The request
 * @param {Object} res The response
 */
exports.createNew = async (req, res)=>{

    // Validate req.body data
    const validation = validationSchema.validate(req.body)
    if(validation.error) return res.status(400).json({ok: false, message: validation.error.details[0].message})

    // Check if the email was unique
    const user = await User.findOne({email: validation.value.email})
    if(user) return res.status(400).json({ok: false, message: "This email already exist !"})

    // Create an Fill the user
    const newUser = new User({
        name: validation.value.name,
        email: validation.value.email,
        password: await bcrypt.hash(validation.value.password, 13),
        auth: validation.value.auth
    })

    // Save the user
    try{
        const savedUser = await newUser.save()
        res.status(201).json({
            ok: true,
            data: savedUser
        })
    }catch(err){
        res.status(400).json({ok:false, message: err.message})
    }
}

/**
 * Get one user by his id
 */
exports.getOne = async (req, res)=>{
    try{
        const user = await User.findOne({_id: req.user._id})
        res.status(200).json({ok: true, data: user})
    }catch(err){
        res.status(400).json({ok:false, message: err.message})
    }
}

/**
 * Update one user from an id
 */
exports.updateOne = async (req, res)=>{

    // Validate req.body
    const validation = await updateValidationSchema.validate(req.body)
    if(validation.error) return res.status(400).json({ok: false, message: validation.error.details[0].message})

    // Pre hash the potential password
    const password = undefined
    if(validation.password) password = await bcrypt.hash(validation.value.password, 13)

    // Try to update the user
    try{
        const user = await User.findOneAndUpdate(
            {_id: req.user._id},
            {$set: {
                name: validation.value.name,
                email: validation.value.email,
                password: password
            }}
        )

        const updatedUser = await User.findOne({_id: user._id})
        
        res.status(200).json({ok: true, data: updatedUser})
    }catch(err){
        res.status(400).json({ok:false, message: err.message})
    }
}

/**
 * Delete a user from his id
 */
exports.deleteOne = async (req, res)=>{
    try{
        const deletedUser = await User.findOneAndRemove({_id: req.user._id})

        res.status(200).json({ok: true, message: `${deletedUser._id} have being removed !`})
    }catch(err){
        res.status(400).json({ok: false, message: err.message})
    }
}

//------------------------------------------------------------------ Users manager

/**
 * Get the login infos of a user
 * @param {String} email The user email you want login infos
 * @returns -1 if there is an error or the user login infos in an object
 */
exports.getLoginInfo = async (email)=>{
    try{

        // Get a user from the provided email
        const user = await User.findOne({email: email})
        if(!user) return -1
    
        // Return the userLoginInfos
        return {
            _id: user._id,
            email: user.email,
            password: user.password,
            auth: user.auth
        }

    }catch(err){
        return -1
    }
}