const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const expressValidator = require('express-validator')

// middlewares
app.use(express.json()); 
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(expressValidator())

//routes
const authRoute = require('./routes/auth')
app.use('/api/auth',authRoute)
const userRoute = require('./routes/users')
app.use('/api/users',userRoute)
const postRoute = require('./routes/posts')
app.use('/api/posts',postRoute)



// database
mongoose.connect(process.env.DATABASE)
        .then(() => console.log('connect ...'))
        .catch((err) => console.error(err))
// server
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`app listen to port ${port} ...`))
