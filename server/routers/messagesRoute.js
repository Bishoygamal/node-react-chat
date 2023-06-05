
const router = require('express').Router();
const authMiddleWare = require('../middleware/authMiddleWare');
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');


router.post('/new-message',authMiddleWare,async(req,res)=>{
    try{
        //store message
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save()

        //update last messgae on chat
       await Chat.findOneAndUpdate({_id:req.body.chat},{lastMessage:savedMessage._id,
        $inc:{unreadMessages:1}
        });
        res.send({
        success:true,
        message:'Message Sent Successfully',
        data:savedMessage
    })

    }catch(error){
        res.send({
            success:true,
            message:'Error Sending Successfully',
            data:error.message
        })
    }
})

//get all messages of chat
router.get('/get-all-messages/:chatId',async(req,res)=>{
    try{
        const message = await Message.find({
          chat:req.params.chatId  
        }).sort({createdAt:1})
        res.send({
            success:true,
            message:'Message fetched successfully',
            data:message
        })
    }catch(error){
        res.send({
            success:false,
            message:'Error fetching successfully',
            data:error.message
        })
    }
})

module.exports=router;