const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const router = require('express').Router();
var jwt = require('jsonwebtoken');
const authMiddleWare = require('../middleware/authMiddleWare');

//USER Registration

router.post('/register', async (req, res) => {
    try {

        //check if user already exists
        const user = await User.findOne({ email: req.body.email })

        if (user) {
            return res.send({
                success: false,
                message: 'user already exist'
            })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        req.body.password = hashedPassword;
        const newUser = new User(req.body)
        await newUser.save()
        return res.send({
            success: true,
            message: 'user added Successfully'
        })

    } catch (err) {
        res.send({
            message: err.message,
            success: false
        })
    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.send({
                success: false,
                message: 'User Does not exist'
            })
        }

        //check if passord is correct

        const validPassword = await bcrypt.compare(req.body.password, user.password)

        if (!validPassword) {
            return res.send({
                success: false,
                message: 'Invalid password'
            })
        }

        //created and assign a token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        return res.send({
            success: true,
            message: "User is logged in Successfully",
            data: token
        })

    } catch (error) {
        return res.send({
            message: error.message,
            success: false
        })
    }
})

router.get('/get-current-user', authMiddleWare, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        res.send({
            success: true,
            message: "User Fetched Successfully",
            data: user
        })
    } catch (error) {
        res.send({
            message: err.message,
            success: false
        })
    }
})

router.get("/get-all-users", authMiddleWare, async (req, res) => {
    try {
        const allUsers = await User.find({ id: { $ne: req.body.userId } })
        res.send({
            success: true,
            message: "User fetched Successfully",
            data: allUsers
        })
    } catch (error) {
        res.send({
            message: err.message,
            success: false
        })
    }
})

module.exports = router;