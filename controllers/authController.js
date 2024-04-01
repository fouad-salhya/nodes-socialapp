const User = require('../models/user')
const jwt = require('jsonwebtoken')

exports.signup = (req,res) => {
    let user = new User(req.body)
         user.save((err,user) => {
             if(err) {
                 return  res.status(400).json({err})
             }
                         user.hashed_password = undefined;
                         user.salt = undefined
                        
                         res.status(200).json({user})
         })
}

exports.signin = (req,res) => {
     const { email , password } = req.body
        User.findOne({email},(err,user) => {
            if(err || !user) {
                return  res.json({err:'email not found'})
            }
            if(!user.authenticated(password)) {
                 return  res.json({err:'password not found'})
            }
            const token = jwt.sign({_id:user._id, role:user.role },process.env.JWT_SECRET)
            res.cookie('token',token,{ expire : new Date() + 99999999999999999999999999999 })
            const { _id, role} = user
             res.json({
                 token, user:{ _id, role }
             })
        })
 }

 exports.signout = (req,res) => {
     res.clearCookie('token')
     res.json({message: 'user signout'})
 }