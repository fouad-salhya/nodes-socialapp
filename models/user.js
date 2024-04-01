const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema


const userSchema = new mongoose.Schema({
      name: {
         type: String,
         required: true,
         minlength: 3,
         
      },
 
      email: {
         type: String,
         required: true,
         minlength: 3,
         trim: true,
        
      },
  
      sexe: {
        type: String,
        required: true,
        trim: true

      },

      city: {
        type: String,
        trim: true 
      },

      hashed_password: {
        type: String,
        required: true
     },

     salt: {
        type: String
     },

     role: {
       type: Number,
       default: 0
     },

      photo: {
        data: Buffer,
        contentType: String
      },

      followers: [
        {
          type: ObjectId, 
          ref: "User" 
        }
      ],

      following: [
        {
          type: ObjectId,
          ref:"User" 
        }
      ],
      
      blockage: [
        {
          type: ObjectId,
          ref: "User"
        }
      ],

      points: {
        type: Number,
        default: 0
      }
}, {timestamps:true})



  module.exports = mongoose.model('User',userSchema)