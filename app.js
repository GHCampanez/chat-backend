const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const path = require('path')

app.use(express.static(path.join(__dirname, 'uploads')))

//protocolo cors para aceitar requisicoes de qualquer dominio
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//importa as rotas de autenticacao e do projeto
require('./controller/index')(app)

const server = app.listen(process.env.PORT || 5000)

module.exports = server

