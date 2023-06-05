const express = require('express')
require('dotenv').config()
const app = express()
const dbConfig = require('./config/dbConfig');
const port =process.env.PORT || 5000;

const usersRoute = require('./routers/userRouter')
const chatRoute = require('./routers/chatsRoute');
const messagesRoute = require('./routers/messagesRoute')
app.use(express.json())
app.use('/api/users',usersRoute)
app.use('/api/chats',chatRoute)
app.use('/api/messages',messagesRoute)

app.listen(port,()=>{
    console.log(`app is running now on port ${port}`)
})