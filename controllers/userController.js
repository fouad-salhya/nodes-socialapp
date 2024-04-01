const User = require('../models/user');


exports.getAllUser = (req, res) => { 

     User.find({_id : { $nin: req.auth._id }})
         .populate("following", "_id name")
         .populate("followers", "_id name")
         .exec((err, users) => {
            if(err || !users) {
                return res.status(404).send(err)
            }
               res.status(200).json({users})    
         })
}


exports.userById = (req, res, next, id) => {
    User.findById(id)
        .populate("following", "_id name")
        .populate("followers", "_id name")
        .populate("blockage", "_id name")
        .exec((err, user) => {
            if(err || !user) {
                return res.status(404).send(err)
            }
                req.user = user
                next()
        })
}

exports.getUserById = (req, res) => {

    let user = req.user
       user.hashed_password = undefined
       user.salt = undefined
       res.json({user})
}

exports.followUser = async (req, res) => {

   await  User.findByIdAndUpdate(req.user._id, { $push: { followers: req.auth._id }}, { new: true })
          User.findByIdAndUpdate(req.auth._id, { $push: { following: req.user._id }}, { new: true })
              .exec((err, result) => {
                if(err) {
                    return res.send(err)
                }
                           res.json({result})
              })
} 


exports.unfollowUser = async (req, res) => {
    
    await User.findByIdAndUpdate(req.user._id, { $pull: { followers:req.auth._id }}, { new: true })
          User.findByIdAndUpdate(req.auth._id, { $pull: { following:req.user._id }}, { new: true} , (err, result) => {
       if(err) {
           return res.send(err)
       }
          res.json({result})
    })
}


exports.deleteAccount = (req, res) => {

     let user = req.user ;

     user.remove((err, result) => {
        if(err) {
            return res.send(err)
        }
            res.json({})
     })
}

exports.blockUser = (req, res) => {
   
    let userId = req.body.userId
     
     User.findByIdAndUpdate(req.auth._id, { $push: { blockage: userId }}, {$new: true},(err, user) => {
        if(err) {
            return res.send(err)
        }
            res.json({user})
     })
}

exports.unblockUser = (req, res) => {

    let userId = req.body.userId

    User.findByIdAndUpdate(req.auth._id, { $pull: { blockage: userId }}, (err, user) => {
        if(err) {
            return res.send(err)
        }
            res.json({user})
    })
}







