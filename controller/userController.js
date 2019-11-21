const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt') 
const User = require('../model/user')
const authSecret = '0800fc577294c34e0b28ad2839435945'
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {

    const { name } = req.body;
    try {
        //verificar se o name é existente
        const users = await User.findOne()
        if (await User.findOne({ name }) || name === '')
            return res.status(400).send({ error: 'Nome ja existe' });

        //Adiciona um novo usuarios
        const user = await User.create(req.body);

        return res.send({
            user,
            token: generateToken({ id: user.id }),
        })

    } catch (err) {
        //Caso ocorra algum erro no processo
        return res.status(400).send({ error: err });
    }
})

router.post('/verify', async (req, res) => {

    const { name, password } = req.body;
    const user = await User.findOne({ name }).select('+password');

    if (!user)
        return res.status(400).send({ error: 'usuario nao encontrado' });


    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'senha invalida' });

    const token = jwt.sign({ id: user.id }, authSecret, {
        expiresIn: 86400,
    });
    res.send({
        user,
        token: generateToken({ id: user.id })
    });

})

function generateToken(params = {}) {
    return jwt.sign(params, authSecret, {
        //expira em 1 dia
        expiresIn: 86400,
    });
}

module.exports = app => app.use('/user', router);
