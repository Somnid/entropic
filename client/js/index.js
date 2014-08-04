document.addEventListener("DOMContentLoaded", function(){
	var startButton = document.getElementById("btn-create");
	var chat = document.getElementById("chat");
	var txtMessage = document.getElementById("txt-message");
	var sendButton = document.getElementById("btn-send");
	var files = document.getElementById("files");
	var localFileTmpl = document.getElementById("local-file-tmpl");
	var remoteFileTmpl = document.getElementById("remote-file-tmpl");
	var chatMessageTmpl = document.getElementById("chat-message-tmpl");

	var dataConnection;
	var eventMessager = EventMessager.create();
	
	var fileView = FileView.create({
		el : files,
		localFileTmpl : localFileTmpl,
		remoteFileTmpl : remoteFileTmpl
	});
	
	var fileSystem = FileSystem.create({
		size : 100 * 1024 * 1024,
		onCreated : fileSystemCreated
	});
	
	function socketOpen(){
		startButton.disabled = false;
	}
	
	function channelOpen(channel){
		txtMessage.disabled = false;
		sendButton.disabled = false;
		eventMessager.addChannel(channel);
	}
	
	function remoteMessageAdd(data){
		var message = document.importNode(chatMessageTmpl.content, true);
		var messageLi = message.querySelector("li");
		messageLi.innerText = data;
		chat.appendChild(message);
	}
	
	function send(){
		eventMessager.emit("message:add", txtMessage.value);
		txtMessage.value = "";
	}
	
	function gotFile(file, arrayBuffer){
		fileSystem.addFile(file, file.name, appendLocalFile);
	}
	
	function getFiles(){
		fileSystem.getAllFiles(function(fileEntries){
			for(var i = 0; i < fileEntries.length; i++){
				appendLocalFile(fileEntries[i]);
			}
		});
	}
	
	function appendLocalFile(fileEntry){
		fileView.localFileAdd(fileEntry);
		eventMessager.emit("file:add", {
			name : fileEntry.name,
			size : fileEntry.size,
			hash : ""
		});
	}
	
	function fileSystemCreated(){
		dataConnection = DataConnection.create({
			socketUrl : Util.getWebSocketUrl(),
			iceServers : [
				{ url : 'stun:stun.l.google.com:19302' }
			],
			onSocketOpen : socketOpen,
			onChannelOpen : channelOpen
		});
		eventMessager.listen("file:add", fileView.remoteFileAdd);
		eventMessager.listen("message:add", remoteMessageAdd);
		getFiles();
		DropZone.init(files, gotFile);
		startButton.addEventListener("click", dataConnection.connect);
		sendButton.addEventListener("click", send);
	}
	
}, true);