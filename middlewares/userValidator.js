
const { check, validationResult } = require('express-validator')


exports.userSignupValidate = (req, res, next) => {

     req.check('name', 'name is required !')
        .notEmpty()
       
     req.check('email', 'email is required !')   
        .notEmpty()
        .isEmail()

     req.check('password', 'password id required !')
        .notEmpty()
        .isLength({ min:6 , max:20 })
        .withMessage('password must betwen 6 and 20 caracters !')

      req.check('age')
         .notEmpty()
         .isInt({min: 18})
         .withMessage('age minimum is 18')

      req.check('sexe', 'gender isrequired !')
         .notEmpty()

        const errors = req.validationErrors();

        if(errors) {
           return  res.json(errors)   
        }

        next()

}