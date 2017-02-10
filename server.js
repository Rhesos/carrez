
var leboncoin = require('./leboncoin');
var meilleursagents = require('./meilleursagents');

var express = require('express');
var fs = require('fs');
var bodyParser = require("body-parser");
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var dealAnswer;
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/css'));

app.use(express.static('web'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/estimateGet', function(req, res){
	res.sendFile( __dirname  + '/views/menu.ejs');
    var deal = "deal";
    res.render('menu.ejs', {
        deal: deal
    }); 
});

app.post('/estimatePost', function(req, res) {

    var isDealGood = "";

	var givenUrl = req.body.url; 
    leboncoin(givenUrl, function(data) {
        meilleursagents(data, function(deal){
            isDealGood = deal;
            res.render('menu.ejs', { 
                deal: isDealGood
            }); 
        })
    });
    
});

var server = app.listen(3100, function () {
	var port = '3100';
	console.log("Server listening at http://localhost:%s", port)
})

