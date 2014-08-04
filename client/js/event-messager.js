var EventMessager = (function(){
	var messageId = 0;

	function emit(resourceAction, payload){
		if(!this.channel || this.channel.readyState != "open"){
			this.queue(resourceAction, payload);
			return;
		}
		var resourceActionSplit = resourceAction.split(":");
		var data = {
			id : messageId++,
			resource : resourceActionSplit[0],
			action : resourceActionSplit[1],
			payload : payload
		};
		var dataString = JSON.stringify(data);
		this.channel.send(dataString);
	}
	
	function listen(resourceAction, callback){
		if(this.listenCallbacks[resourceAction]){
			this.listenCallbacks[resourceAction].push(callback);
		}else{
			this.listenCallbacks[resourceAction] = [callback];
		}
	}
	
	function addChannel(channel){
		this.channel = channel;
		if(this.channel.readyState != "open"){
			var oldOpen = this.channel.onopen;
			this.channel.onopen = (function(e){
				this.flushQueue();
				oldOpen(e);
			}).bind(this);
		}else{
			this.flushQueue();
		}
		this.channel.onmessage = this.receiveMessage;
	}
	
	function queue(resourceAction, payload){
		this.emitQueue.push({
			resourceAction : resourceAction,
			payload : payload
		});
	}
	
	function flushQueue(){
		for(var i = 0; i < this.emitQueue.length; i++){
			this.emit(this.emitQueue[i].resourceAction, this.emitQueue[i].payload);
		}
	}
	
	function receiveMessage(message){
		if(message.data instanceof ArrayBuffer){
			//do array buffer stuff
			return;
		}
		var messageObject = JSON.parse(message.data);
		var callbacks = this.listenCallbacks[messageObject.resource + ":" + messageObject.action];
		for(var i = 0; i < callbacks.length; i++){
			callbacks[i](messageObject.payload);
		}
	}

	function create(options){
		var eventMessager = {};
		options = options || {};
		
		eventMessager.emitQueue = [];
		eventMessager.listenCallbacks = {};
		
		eventMessager.emit = emit.bind(eventMessager);
		eventMessager.listen = listen.bind(eventMessager);
		eventMessager.addChannel = addChannel.bind(eventMessager);
		eventMessager.queue = queue.bind(eventMessager);
		eventMessager.flushQueue = flushQueue.bind(eventMessager);
		eventMessager.receiveMessage = receiveMessage.bind(eventMessager);
		
		if(options.channel){
			eventMessager.addChannel(options.channel);
		}
		
		return eventMessager;
	}
	
	return {
		create : create
	};

})();