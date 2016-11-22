var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.resolve(__dirname+'/../views/signup.html'));
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
            res.sendFile(path.resolve(__dirname+'/../views/responses/blanksign.html'));
    }
    else if(pass!==conf){
            res.sendFile(path.resolve(__dirname+'/../views/responses/pass_not_match.html'));
    }
    else
    MongoClient.connect(url, function(err, db) {
        if (err) {
            res.send('Unable to connect to the mongoDB server. Error:', err);
        } else {
            var collection = db.collection('login');
            var user1 = {
                    username: user,
                    password: pass
                };
            collection.find({
                    username: user
            }).toArray(function(err, result) {
                if (err) {
                        res.send(err);
                } else if (result.length) {
                        res.sendFile(path.resolve(__dirname+'/../views/responses/user_exists.html'));

                } else {
                    collection.insert([user1], function(err, result) {
                            if (err) {
                                res.send(err);
                            }   else {
                                res.sendFile(path.resolve(__dirname+'/../views/responses/acc_created.html'));

                            }
                    });
                }

                });
            }

        });


});
module.exports = router;
