var server = require("./server");
var router = require("./router");
var config = require("./config");

server.start(config.port, router);