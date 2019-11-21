const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')

//protocolo cors para aceitar requisicoes de qualquer dominio
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

//importa as rotas de autenticacao e do projeto
require('./controller/index')(app)

app.listen(5000)