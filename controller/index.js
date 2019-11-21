const chatController = require('./chatController')
const userController = require('./userController')

module.exports = function (app) {
    chatController(app)
    userController(app)
};