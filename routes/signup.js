var express = require('express');
var router = express.Router();
var path = require('path');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render("signup");
});
router.post('/', function(req, res, next) {
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;

    // Connection URL. This is where your mongodb server is running.
    var url = process.env.MLABURI;
    var user = req.body.user;
    var pass = req.body.pswd;
    var conf = req.body.pswdconf;
    var good = "yes";
    var error = "";
    module.exports = good;
    // Use connect method to connect to the Server
    if(pass.length==0 || user.length==0 || conf.length==0){
        res.render("responses/blanksign");
    }
    else if(pass!==conf){
            res.render("responses/pass_not_match");
    }
    else
    MongoClient.connect(url, function(err, db) {

        var passtosave = bcrypt.hashSync(pass, salt);

        if (err) {
            res.send('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var collection = db.collection('login');
            var user1 = {
                    username: user,
                    password: passtosave
                };
            collection.find({
                    username: user
            }).toArray(function(err, result) {
                if (err) {
                        res.send(err);
                } else if (result.length) {
                    res.render("responses/user_exists");

                } else {
                    collection.insert([user1], function(err, result) {
                            if (err) {
                                res.send(err);
                            }   else {
                                res.render("responses/acc_created");
                                

                            }
                    });
                }

                });
            }

        });


});
module.exports = router;
