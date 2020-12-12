const mongoose = require('mongoose');

const user = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    host: {
        type: Boolean,
        default: false
    }
});


let UserModel = mongoose.model('users', user);
module.exports = UserModel;