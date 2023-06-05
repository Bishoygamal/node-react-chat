const router = require('express').Router();
const authMiddleWare = require('../middleware/authMiddleWare');
const chat = require('../models/chatModel');
const Message = require('../models/messageModel')

//create New CHAT
router.post('/create-new-chat', authMiddleWare, async (req, res) => {
    try {
        const newChat = new chat(req.body);
        const savedChat = await newChat.save()

        //populate members and last Message
        await (await savedChat.populate('members'))
        res.send({
            success: true,
            message: 'CHAT created Successfully',
            data: savedChat
        })
    } catch (error) {
        res.send({
            success: false,
            message: 'Error creating chat',
            error: error.message
        })
    }
})


//get all chats of current uses

router.get('/get-all-chats', authMiddleWare, async (req, res) => {
    try {
        const chats = await chat.find({ members: { $in: [req.body.userId] } }).populate('members').populate('lastMessage').sort({ updateChat: -1 });
        res.send({
            success: true,
            message: 'chats fetched Successfully',
            data: chats
        })
    } catch (error) {
        res.send({
            success: false,
            message: 'Error fetching Successfully',
            error: error.message
        })
    }
})

//clear all read messages of a chat
router.post('/clear-unread-messages', authMiddleWare, async (req, res) => {
    try {
        const chat = await Chat.findById(req.body.chatId);
        if (!chat) {
            res.send({
                success: false,
                message: 'chat not found',
            })
        }
        const updateChat = await Chat.findByIdAndUpdate(req.body.chat, { unreadMessages: 0 }, { new: true }).populate("members").populate("lastMessage")
        await Message.updateMany({
            chat: req.body.chat,
            read: false
        }, {
            read: true
        })
        res.send({
            success: true,
            message: 'unread messages cleared successfully',
            data: updateChat
        })
    }
    catch (error) {
        res.send({
            success: false,
            message: 'Error clearing unread Messages',
            error: error.message
        })
    }
})

module.exports = router;