const mongoose = require('../database/db');
const bcrypt = require('bcrypt') 
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
});

UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User;