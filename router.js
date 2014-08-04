var fs = require("fs");
var pathHelper = require("./pathHelper");
var mimeMapper = require("./mimeMapper");
var config = require("./config");

function route(pathname, response){
	function handleError(pathname, response){
		console.log("error with path: " + pathname);
		response.writeHead(404, {'Content-Type': 'text/plain'});
		response.end("Could not find file: " + pathname);
	}
	function cleanPath(path){
		if(pathHelper.getExtension(path) == ""){
			return config.basePath + path + "index.html";
		}
		return config.basePath + path;
	}
	
	var pathname = cleanPath(pathname);
	var mimeType = mimeMapper.mapMimeType(pathname);
	
	fs.readFile(pathname, function(error, data){
		if(error){
			handleError(pathname, response);
			return;
		}
		response.writeHead(200, {
			'Content-Type': mimeType, 
			'Content-Length': data.length 
		});
		response.end(data);
	});
}

exports.route = route;