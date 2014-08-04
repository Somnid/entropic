var http = require('http');
var ws = require('websocket');
var url = require('url');

var clients = {};
var index = 0;

function start(port, router){
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		router.route(pathname, response);
	}

	var httpServer = http.createServer(onRequest);
	httpServer.listen(port);
	console.log('Server running at http://127.0.0.1:' + port + '/');
	
	var wsServer = new ws.server({ httpServer : httpServer });
	wsServer.on('request', function(request){
		var socket = request.accept(null, request.origin);
		var socketKey = index;
		index++;
		
		socket.on("message", function(msg){
			console.log("remitting message from client: " + socketKey);
			for(var key in clients){
				if(key != socketKey){
					clients[key].sendUTF(msg.utf8Data);
				}
			}
		});
		socket.on("close", function(socket){
			delete clients[socketKey];
			console.log("client " + socketKey +  " disconnected");
		});
		
		clients[socketKey] = socket;
		console.log("client connected: " + socketKey);
	});
}
exports.start = start;
