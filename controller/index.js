const chatController = require('./chatController')
const userController = require('./userController')
const videoController = require('./videoController')

module.exports = function (app) {
    chatController(app)
    userController(app)
    videoController(app)
};