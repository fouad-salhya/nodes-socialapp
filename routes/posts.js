const express = require('express')
const router = express.Router()


const { 
        createPost, 
        getFollowingPosts, 
        getPostById, 
        postById,
        imagePost, 
        deleteMyPost, 
        getMyPosts, 
        isMyPost, 
        likePost,
        dislikePost,
        removeLike,
        removeDislike,

      } = require('../controllers/postController')

const { 
        userById 
      } = require('../controllers/userController')

const { 
        requireSignin, 
        isAuth 
       } = require('../middlewares/auth')

router.post('/create',[requireSignin],createPost)
router.get('/following/all/:userId',[requireSignin], getFollowingPosts);
router.get('/:postId',[requireSignin],getPostById)
router.get('/image/:postId',imagePost)
router.delete('/delete/:postId',[requireSignin,isMyPost],deleteMyPost)
router.get('/myPosts/:userId',[requireSignin],getMyPosts)
router.patch('/like/:postId',[requireSignin],likePost)
router.patch('/like/remove/:postId',[requireSignin],removeLike)
router.patch('/dislike/:postId',[requireSignin],dislikePost)
router.patch('/dislike/remove/:postId',[requireSignin],removeDislike)

router.param('postId',postById)
router.param('userId',userById)





module.exports = router