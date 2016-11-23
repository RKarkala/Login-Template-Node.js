var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var signup_scehma = new Schema({
    username: String,
    password: String
});
var signupuser = mongoose.model('users', signup_scehma);
module.exports = signupuser;
