/**
 * 
 */
//var server = require("./server");
//var router = require("./router");

var express = quire("express");
var app = express();
var port = 9200;

app.listen(port);


app.get("/", function (req, res){
	res.send("Hello!!");
	res.end();
});

console.log("Server is up!");

//server.start(router.route);
