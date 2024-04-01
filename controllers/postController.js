const Post = require('../models/post')
const _ = require('lodash');
const formidable = require('formidable')
const fs = require('fs')
const User = require('../models/user')

exports.createPost =  (req, res) => {

    let form = new formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req,(err,fields,files) => {
      if(err) {
          res.status(400).json({err})
      }
      let post = new Post(fields)
          post.author = req.auth._id
      if(files.image) {
        post.image.data = fs.readFileSync(files.image.path)
        post.image.contentType = files.image.type
      }
     post.save((err, post) => {

        if (err) {
          return res.status(400).json({ err });
        }
        res.json({ post });
      })
     
    
  })
}

exports.updatePost = (req,res) => {

  let form = new formidable.IncomingForm()
  form.keepExtensions = true;
  form.parse(req,(err,fields,files) => {
      if(err) {
          res.status(400).json({err})
      }
      let post = req.post
          post = _.extend(post,fields)
          if(files.image){
              post.image.data = fs.readFileSync(files.image.path)
              post.image.contentType = files.image.type
          }
          post.save((err,post) => {
             if(err) {
                 res.status(400).json({err});
             }
             res.json({post})
          })
  })
       
}


exports.getFollowingPosts = (req, res) => {
    
     Post.find({author: { $in: req.user.following }})
         .populate("author", "_id name")
         .populate("likes", "_id name")
         .populate("dislikes","_id name")
         .sort({createdAt: -1})
         .exec((err, posts ) => {
          if(err) {
            return res.status(404).send(err)
          }
                   res.status(200).json({posts})
         })

}

exports.getMyPosts = (req, res) => {
   
     let userId = req.auth._id || req.user._id || req.params._id
   
      Post.find({author: { $in: userId }})
          .sort({createdAt: -1})
          .select("-image")
          .populate("author", "_id name image")
          .populate("likes","_id name")
          .populate("dislikes", "_id name")
          .exec((err, myPosts) => {
            if(err) {

               return res.status(404).send(err)
            }  
              
               res.status(200).json({myPosts})
          })
}

exports.isMyPost = (req, res, next) => {
  

  let myPost = (req.auth._id) && (req.post.author) && (req.auth._id == req.post.author)
    
      if(!myPost) {
         return res.status(404).json({message: "access denied"})
      }
        next()
}

exports.deleteMyPost = (req, res) => {

   let postId = req.body.postId || req.params.postId
   
   Post.findByIdAndDelete(postId, { $new: true }, (err, result) => {
    if(err) {
      return res.send(err)
    }
      res.json({})
   })

}

exports.imagePost = (req,res) => {
          
  const { data , contentType } = req.post.image
  if(data) {
      res.set('Content-Type',contentType)
      return res.send(data)
  }
}

exports.postById = (req, res, next, id) => {

    Post.findById(id)
        .exec((err, post) => {
          if(err) {
            return res.status(404).send(err)
          }
            req.post = post
            next();
        })
}

exports.getPostById = (req, res) => {

    let post = req.post
    
    res.json({post})

}

exports.likePost = async (req, res) => {   
   
  await Post.findByIdAndUpdate(req.post._id, { $push: { likes: req.auth._id}},{ new: true }) 
 
        Post.findByIdAndUpdate(req.post._id, { $pull: { dislikes: req.auth._id}}, { new: true })
            .exec((err, postLike) => {
              if(err) {
                return res.send(err)
             }
                       res.json({postLike})
        })
       

}

exports.removeLike = async (req, res) => {
     
     Post.findByIdAndUpdate(req.post._id, { $pull: { likes: req.auth._id }}, { new: true })
         .exec((err, result) => {
          if(err) {
            return res.send(err)
          }
                   return res.json({result})
         })
     
}

exports.dislikePost = async (req, res) => {

    await Post.findByIdAndUpdate(req.post._id, { $push: { dislikes: req.auth._id}}, { new: true })
    
          Post.findByIdAndUpdate(req.post._id, { $pull: { likes: req.auth._id }}, { new: true })
              .exec((err, postDislike) => {
                  if(err) {
                    return res.send(err)
                  }
                           res.json({postDislike})
              })    
        
}

exports.removeDislike = async (req, res) => {
    
     Post.findByIdAndUpdate(req.post._id, { $pull: { dislikes: req.auth._id }}, { new: true })
         .exec((err, result) => {
          if(err) {
            return res.send(err)
          }
                   res.json({result})
         })
        
}



// exports.addComment = (req, res) => {
  
//       let comment = { text: req.body.text }
//           comment.postedBy = req.auth._id
//       Post.findByIdAndUpdate(req.body.postId, { $push: { comments: comment }}, { $new: true }, (err, post) => {
           
//            if(err) {
//             return res.send(err)
//            }
//            res.json({post})

//       })
// }

// exports.deleteMyComment = (req, res) => {
    
//      let commentId = req.body.commentId
//     Post.findByIdAndUpdate(req.body.postId, { $pull: { comments: { _id: commentId } }}, { $new: true }, (err, post) => {

//         if(err) {
//           return res.send(err)
//         }
//          res.json({post})
//     })
   
// }




