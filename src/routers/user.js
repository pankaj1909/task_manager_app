const express = require('express')
const router = new express.Router()
const User = require('../models/User')
const auth = require('../middleware/authentication')
const multer = require('multer')
const sharp = require('sharp')

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, callback) {
        //regular expression used \.(jpg|jpeg)$
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('File is not of type that is accepted'))
        }
        callback(undefined, true)
    }
})

//Creating new user
router.post('/user', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

//login a user
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

//logout a user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

//logoutAll a user
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})

//finding a user
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/user/:id', async (req, res) => {

    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }

})

//updating user
router.patch('/userUpdate/me', auth, async (req, res) => {
    const allowedUpdatesArray = ['name', 'email', 'password', 'age']
    const isValid = Object.keys(req.body).every((update) => {
        return allowedUpdatesArray.includes(update)
    })

    if (!isValid) {
        return res.status(400).send({error: 'Invalid property'})
    }

    try {
        const user = req.user
        Object.keys(req.body).forEach((update) => user[update] = req.body[update])
        await user.save()
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

// deleting user
router.delete('/deleteUser/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})


router.post('/user/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/user/me/deleteAvatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.get('/user/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()

    }
})

module.exports = router