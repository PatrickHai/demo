// var MongoClient = require('mongodb').MongoClient;
// var assert = require('assert');


// var url = 'mongodb://localhost:27017/test';

// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected correctly to server.");
//   db.close();
// });


var mongo = require('mongodb'), Server = mongo.Server, Db = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('test', server);

exports.getCategory = function(success){
  db.open(function(err, db) {
      if(!err) {
          db.collection('category', function(err, collection){
            collection.find().toArray(function(error, bars){
              success(bars);
            });
          });
      }
  });
};

exports.getMainCategory = function(success){
  db.open(function(err, db) {
      if(!err) {
          db.collection('maincategory', function(err, collection){
            collection.find().toArray(function(error, bars){
              success(bars);
            });
          });
      }
  });
};