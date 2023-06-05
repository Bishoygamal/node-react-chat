const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL)

const db=mongoose.connection;

db.on('connected',()=>{
    console.log('Mongo DB Connection Successfully')
})

db.on('error',()=>{
    console.log('Mongo DB Connection Failed')
})

module.exports=db;