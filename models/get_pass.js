var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pass = new Schema({
    username: String
});
var getpass = mongoose.model('pass', pass);
module.exports = getpass;
