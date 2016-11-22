var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.resolve(__dirname+'/../views/login.html'));
});
router.post('/', function(req, res){
    var mongodb = require('mongodb');

    //We need to work with "MongoClient" interface in order to connect to a mongodb server.
    var MongoClient = mongodb.MongoClient;

    // Connection URL. This is where your mongodb server is running.
    var url = process.env.MLABURI;
  var user = req.body.user;
  var pass = req.body.pswd;
  console.log(user);
  console.log(pass);
  // Use connect method to connect to the Server
  if(user.length==0 || pass.length==0){
      res.sendFile(path.resolve(__dirname+'/../views/responses/blanklog.html'));
  }else
  MongoClient.connect(url, function (err, db) {
    if (err) {
      res.send('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)

      // Get the documents collection
      var collection = db.collection('login');
      //Create some users

    collection.find({username: user, password: pass}).toArray(function (err, result) {
    if (err) {
      res.send(err);
    } else if (result.length) {
      res.sendFile(path.resolve(__dirname+'/../views/responses/login_success.html'));
    } else {
      res.sendFile(path.resolve(__dirname+'/../views/responses/incorrect.html'));
    }
    //Close connection
    db.close();
  });



    }
  });
});
module.exports = router;
