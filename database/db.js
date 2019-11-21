const mongoose = require('mongoose');

const local = 'mongodb://localhost/chat'
const atlas = 'mongodb+srv://teste:teste@cluster0-bcexw.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(atlas,{ useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;

module.exports = mongoose;