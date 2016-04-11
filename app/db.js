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



var mysql = require('mysql');  
      
var TEST_DATABASE = 'test';  
  
//创建连接  
var client = mysql.createConnection({  
  host: 'localhost',
  port: '3306',
  user: 'root',  
  password: '',  
});  

client.connect();
client.query("use " + TEST_DATABASE);


exports.getMedication = function(success){
  var result = {
        "name": "白加黑",
        "children": [{
            "name": "适应症",
            "children": [{
                "name": "发热"
            }, {
                "name": "头痛",
                "size": 3812
            }, {
                "name": "四肢酸痛",
                "size": 6714
            }, {
                "name": "喷嚏",
                "size": 743
            }, {
                "name": "流鼻涕",
                "size": 743
            }, {
                "name": "鼻塞",
                "size": 743
            }, {
                "name": "咳嗽",
                "size": 743
            }]
        },
        { "name": "用法用量：白天服用,一日二次,每次1～2片"},
        { "name": "不良反应：偶见轻度乏力.恶心.上腹不适.食欲不振.口干等"}
        ]
};
  success(result); 
};

