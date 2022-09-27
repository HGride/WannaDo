const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('./user.controller')

/**
 * Generate an access token from an object
 * @param {Object} data The object to encode
 * @returns The access token
 */
function genAccessToken(data){
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1800s'})
}

/**
 * Generate an refresh token from an object
 * @param {Object} data The object to encode
 * @returns The refres token
 */
function genRefreshToken(data){
    return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1y'})
};

/**
 * Generate an admin token from an object
 * @param {Object} data The object to encode
 * @returns The admin token
 */
function genAdminToken(data){
    return jwt.sign(data, process.env.ADMIN_TOKEN_SECRET)
}

// Accordate or not an acces via token
exports.authToken = (req, res, next)=>{

    // Pickup the token into the headers
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer qlljmlqkjenkjlgqsg6q5erqe54qdhg

    // Check if the token exsist
    if(!token) return res.sendStatus(401)

    // If it was an admin token
    jwt.verify(token, process.env.ADMIN_TOKEN_SECRET, (err, admin)=>{
        if(!err){
            req.user = {...admin, admin: true}
            next()
        }else{

            // Verify the token and go to the next middleware or req/res function
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
                if(err) return res.sendStatus(401)
                req.user = user
                next();
            })
        }
    })

}

// Accordate or not an access via an admin token
exports.adminAuthToken = (req, res, next)=>{
    // Pickup the token into the headers
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer qlljmlqkjenkjlgqsg6q5erqe54qdhg

    // Check if the token exsist
    if(!token) return res.sendStatus(401)

    // If it was an admin token
    jwt.verify(token, process.env.ADMIN_TOKEN_SECRET, (err, admin)=>{
        if(err) return res.sendStatus(401)
        req.user = {...admin, admin: true}
        next()
    })
}

// Login
exports.login = async (req, res)=>{

    // Pick up all users informations
    let user = await User.getLoginInfo(req.body.email)

    let accessToken, refreshToken;

    if(user != -1){

        let passwordValidation = bcrypt.compareSync(req.body.password, user.password)

        const userPermision = user.auth

        if(passwordValidation){

            delete user.password
            accessToken = genAccessToken(user)
            refreshToken = genRefreshToken(user)

            if(userPermision.indexOf('admin') != -1){
                let adminToken = genAdminToken(user)
                res.json({
                   login: true,
                    accessToken,
                    refreshToken,
                    adminToken
                })
                return;
            }else{
                res.json({
                    login: true,
                    accessToken,
                    refreshToken
                })
            }

            
        }else{
            res.status(401).json({login: false})
            return;
        }
    }else{
        res.status(401).json({login: false})
        return;
    }
    
}

// Refresh token
exports.refreshToken = async (req, res)=>{

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer qlljmlqkjenkjlgqsg6q5erqe54qdhg

    if(!token){
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET,async (err, user)=>{
        if(err){
            return res.sendStatus(401)
        }

        // TODO: Check en BDD si le user a toujour les droits et qu'il existe toujour
        let findedUser = await User.getLoginInfo(user.email)

        let passwordValidation = bcrypt.compareSync(req.body.password, findedUser.password)
        if(findedUser == -1) return res.sendStatus(401)
        if(!passwordValidation) return res.sendStatus(401)
    
        // Needed if we want te regenerate a new token
        delete findedUser.iat;
        delete findedUser.exp;
    
        const refresedToken = genAccessToken(findedUser)
    
        res.json({
            'ok': true,
            'accessToken': refresedToken
        })
    });

}

// Check if the email already exist or not !
/**
 * checkEmail return true if the email already exist an false if not
 * @param {string} email - The email you wanna check
 * @returns {boolean}
 */
exports.checkEmail = async (testEmail)=>{

    // Try to find a user with the email
    const user = await User.getLoginInfo(testEmail)

    // If a user exist return true
    if(user != -1) return true
    // Else return false
    return false
}