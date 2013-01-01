/**
 * New node file
 */

var http = require("http");
var url = require("url");
var querystring = require("querystring");

var start = function (route){
	var requestListener = function (req, response) {
		var pathname = url.parse(req.url).pathname;
		
		console.log("Request " + pathname);
		route(pathname);
		 
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("Hello World");
		response.end();
	};
	http.createServer(requestListener).listen(8888);
	console.log("Server started"); 
 };
 
 exports.start = start;