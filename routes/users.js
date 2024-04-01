const express = require('express')
const router = express.Router()


const { 
        getAllUser,
        getUserById,
        userById,
        followUser,
        unfollowUser, 
        deleteAccount, 
        blockUser, 
        unblockUser, 
      } = require('../controllers/userController')
const { 
        requireSignin, 
        isAuth 
      } = require('../middlewares/auth')



router.get('/all',[requireSignin],getAllUser)
router.get('/:userId',[requireSignin],getUserById)
router.put('/follow/:userId',[requireSignin],followUser)
router.put('/unfollow/:userId',[requireSignin],unfollowUser)
router.delete('/delete/:userId',[requireSignin,isAuth],deleteAccount)
router.put('/block',[requireSignin],blockUser)
router.put('/unblock',[requireSignin],unblockUser)


router.param('userId',userById)



module.exports = router