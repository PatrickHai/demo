var express = require('express')
var app = express()

app.use(express.static(__dirname))
app.listen(process.env.PORT || 9000)

var db_service = require('./db')


app.get('/api/category', function(req,res){
    db_service.getCategory(function(result){
        res.contentType('json')
        res.setHeader('content-type', 'text/html;charset=utf-8');
        res.write(JSON.stringify(result))
        res.end()
    });
})

app.get('/api/maincategory', function(req,res){
    db_service.getMainCategory(function(result){
        res.contentType('json')
        res.setHeader('content-type', 'text/html;charset=utf-8');
        res.write(JSON.stringify(result))
        res.end()
    });
})