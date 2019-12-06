const express = require('express')
const multer = require('multer')
const router = express.Router()
const client = require('./clientReds')
const User = require('../model/user')
const Messages = require('../model/messages')
const authMiddleware = require('./auth')


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.mp4')
    }
})

var upload = multer({ storage: storage })

router.use(authMiddleware)


router.get('/users', async (req, res) => {

    const userRedisKey = 'user:list'

    return client.get(userRedisKey, async (err, users) => {

        if (users) {
            res.status(200).send(users)
        } else {

            try {

                //find all users
                const user = await User.find({})

                client.setex(userRedisKey, 600, JSON.stringify(user))
                res.status(200).send(user)
            } catch (err) {
                res.status(400).send({ error: "falha ao listar usuarios" });

            }
        }

    })

})

router.get('/conversation', async (req, res) => {

    const chatName = req.query.chat
    const conversationRedisKey = `messages:${chatName}`

    return client.get(conversationRedisKey, async (err, messages) => {

        if (messages) {
            res.status(200).send(messages)
        } else {

            try {


                let message = await Messages.findOne({ chatName })

                if (message == null)
                    message = await Messages.create({ chatName: chatName, messages: [] })

                client.setex(conversationRedisKey, 600, JSON.stringify(message))

                res.status(200).send(message);

            } catch (err) {
                res.status(400).send({ error: "falha ao buscar conversas" });

            }

        }
    })
})

router.post('/conversation', async (req, res) => {

    const { chatName, messages } = req.body
    try {
        Messages.findOneAndUpdate({ chatName }, { chatName, messages }, { upsert: true }, function (err, doc) {
            if (err) return res.send(500, { error: err })

            const conversationRedisKey = `messages:${chatName}`
            client.del(conversationRedisKey)

            res.status(200).send(doc)
        })

    } catch (err) {
        res.status(400).send({ error: "falha ao atualizar mensagens" })

    }
})

router.post('/conversation/message', async (req, res) => {

    const { chatName, message, user } = req.body
    try {
        let chat = await Messages.findOne({ chatName })
        chat.messages.push({ message, user })

        Messages.findOneAndUpdate({ chatName }, { chatName, messages: chat.messages }, { upsert: true }, function (err, doc) {
            if (err) return res.send(500, { error: err })

            const conversationRedisKey = `messages:${chatName}`
            client.del(conversationRedisKey)    

            res.status(200).send(doc)
        })


    } catch (err) {
        res.status(400).send({ error: "falha ao atualizar mensagens" })

    }
})




router.post('/conversation/video', upload.single('video'), async (req, res) => {

    let { chatName, message, user } = req.body

    const video = req.file
    var totalSizeMB = Number(video.size / Math.pow(1024, 2).toFixed(1))



    //Limit video size for 5mb
    if (totalSizeMB > 5.0)
        return res.status(400).send({ error: 'Tamanho máximo de 5mb excedido' })

    let url = req.protocol + '://' + req.get('host') + '/video?videoPath=' + video.path;

    try {
        let chat = await Messages.findOne({ chatName })
        chat.messages.push({ message, user, video: url })

        Messages.findOneAndUpdate({ chatName }, { chatName, messages: chat.messages }, { upsert: true }, function (err, doc) {
            if (err) return res.send(500, { error: err })

            const conversationRedisKey = `messages:${chatName}`
            client.del(conversationRedisKey)  
            
            res.status(200).send(doc)
        })


    } catch (err) {
        res.status(400).send({ error: 'falha ao atualizar mensagens' })

    }

})



module.exports = app => app.use('/chat', router);
