const express = require('express')
const router = express.Router()

const User = require('../model/user')
const Messages = require('../model/messages')
const authMiddleware = require('./auth')


router.use(authMiddleware)

router.get('/users', async (req, res) => {

    try {
        //procura todos usuarios
        const user = await User.find({});

        res.status(200).send(user);
        // res.status(200).send(JSON.stringify(user));
    } catch (err) {
        res.status(400).send({ error: "falha ao listar usuarios" });

    }
})

router.get('/conversation', async (req, res) => {

    const chatName = req.query.chat

    try {
        let message = await Messages.findOne({ chatName })

        if (message == null)
            message = await Messages.create({ chatName: chatName, messages: [] })

        res.status(200).send(message);

    } catch (err) {
        res.status(400).send({ error: "falha ao buscar conversas" });

    }
})

router.post('/conversation', async (req, res) => {

    const { chatName, messages } = req.body
    try {
        Messages.findOneAndUpdate({ chatName }, { chatName, messages }, { upsert: true }, function (err, doc) {
            if (err) return res.send(500, { error: err })
            res.status(200).send(doc)
        })

    } catch (err) {
        res.status(400).send({ error: "falha ao atualizar mensagens" })

    }
})

module.exports = app => app.use('/chat', router);
