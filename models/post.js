const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema


const postSchema = new mongoose.Schema({
  
     text: {
        type:String
     },
     image: {
        data:Buffer,
        contentType:String
     },
     author: {
      type: ObjectId,
      ref: "User"
     },
     likes:[{
        type: ObjectId,
        ref: "User"
     }],
     dislikes:[{
      type: ObjectId,
      ref:"User"
     }]
}, { timestamps: true })


module.exports = mongoose.model('Post', postSchema)