var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var signup = require('./routes/signup');

var app = express();

// view engine setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/signup', signup);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = process.env.MLABURI;




app.post('/signup', function(req, res){
  var user = req.body.user;
  var pass = req.body.pswd;// Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      res.send('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      // Get the documents collection
      var collection = db.collection('login');
      //Create some users
      var user1 = {username: user, password: pass};
      collection.find({username: user}).toArray(function (err, result) {
      if (err) {
        res.send(err);
      } else if (result.length) {
        res.send('Username Already Exists');
      } else {
        collection.insert([user1], function (err, result) {
          if (err) {
            res.send(err);
          } else {
            res.send('User Created');
          }
        });
      }


    });
      // Insert some users

    }

  });

});
app.post('/', function(req, res){
  var user = req.body.user;
  var pass = req.body.pswd;
  // Use connect method to connect to the Server
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
      res.send('Logged in Succesfully');
    } else {
      res.send('Incorrect Username or Password');
    }
    //Close connection
    db.close();
  });



    }
  });
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
