var DataConnection = (function(){

	function connect(){
		this.createDataChannel();
		this.peerConnection.createOffer(this.createOfferDone);
	}
	
	function createOfferDone(offerSessionDescription){
		console.log("creating offer");
		this.peerConnection.setLocalDescription(offerSessionDescription, this.offerLocalDescriptionDone)
	}
	
	function offerLocalDescriptionDone(){
		var description = JSON.stringify(this.peerConnection.localDescription)
		console.log("sending description");
		this.socket.send(description);
	}
	
	function offerRemoteDescriptionDone(){
		console.log("set remote description from offer");
		this.peerConnection.createAnswer(this.createAnswerDone);
	}
	
	function createAnswerDone(answerSessionDescription){
		this.peerConnection.setLocalDescription(answerSessionDescription, this.answerLocalDescriptionDone);
	}
	
	function answerLocalDescriptionDone(){
		var description = JSON.stringify(this.peerConnection.localDescription)
		console.log("sending description");
		this.socket.send(description);
	}

	function answerRemoteDescriptionDone(){
		console.log("set remote description from answer");
	}
	
	function message(event){
		var data = JSON.parse(event.data);
		switch(data.type){
			case "offer":
				console.log("we got an offer, answering");
				var description = new RTCSessionDescription(data);
				this.peerConnection.setRemoteDescription(description, this.offerRemoteDescriptionDone);
				break;
			case "answer":
				console.log("they answered our offer and are sending their description");
				var description = new RTCSessionDescription(data);
				this.peerConnection.setRemoteDescription(description, this.answerRemoteDescriptionDone);
				break;
			case "candidate":
				console.log("got new ice candidate");
				delete data.type;
				this.peerConnection.addIceCandidate(new RTCIceCandidate(data));
				break;
		}
	}
	
	function gotIceCandidate(e){
		if(e.candidate){
			e.candidate.type = "candidate";
			this.socket.send(JSON.stringify(e.candidate));
		}
	}
	
	function createDataChannel(){
		this.dataChannel = this.peerConnection.createDataChannel("data", {
			reliable: true
		});
		
		this.dataChannel.onerror = error.bind(this);
		this.dataChannel.onopen = channelOpen.bind(this);
		this.dataChannel.onclose = log.bind(this, "Channel Closed");
		this.dataChannel.onmessage = channelMessage.bind(this);
	}
	
	function gotDataChannel(e){
		this.dataChannel = e.channel;
		this.dataChannel.onerror = error.bind(this);
		this.dataChannel.onopen = channelOpen.bind(this);
		this.dataChannel.onclose = log.bind(this, "Channel Closed");
		this.dataChannel.onmessage = channelMessage.bind(this);
	}
	
	function send(message){
		if(typeof(message) != "object" || message instanceof ArrayBuffer || message instanceof Blob){
			this.dataChannel.send(message);
		}else{ //is some other object
			var json = JSON.stringify(message);
			this.dataChannel.send(json);
		}
	}

	function error(e){
		console.error("error", e);
	}
	
	function log(text, e){ 
		console.log(text, e);
	}
	
	function socketOpen(){
		this.onSocketOpen();
	}
	
	function channelOpen(){
		this.onChannelOpen(this.dataChannel);
	}
	
	function channelMessage(e){
		this.onChannelMessage(e.data);
	}
	
	function noop(){
	}

	function create(options){
		var dataConnection = {};
		options = options || {};
		dataConnection.socket = new WebSocket(options.socketUrl);
		dataConnection.socket.onerror = error.bind(dataConnection);
		dataConnection.socket.onclose = log.bind(this, "Socket Closed");
		dataConnection.socket.onopen = socketOpen.bind(dataConnection);
		dataConnection.socket.onmessage = message.bind(dataConnection);
		
		dataConnection.peerConnection = new webkitRTCPeerConnection({
			'iceServers': options.iceServers
		});
		dataConnection.peerConnection.ondatachannel = gotDataChannel.bind(dataConnection);
		dataConnection.peerConnection.onicecandidate = gotIceCandidate.bind(dataConnection);
		
		dataConnection.onSocketOpen = options.onSocketOpen || noop;
		dataConnection.onChannelOpen = options.onChannelOpen || noop;
		dataConnection.onChannelMessage = options.onChannelMessage || noop;
		
		dataConnection.createDataChannel = createDataChannel.bind(dataConnection);
		dataConnection.connect = connect.bind(dataConnection);
		dataConnection.createOfferDone = createOfferDone.bind(dataConnection);
		dataConnection.offerLocalDescriptionDone = offerLocalDescriptionDone.bind(dataConnection);
		dataConnection.offerRemoteDescriptionDone = offerRemoteDescriptionDone.bind(dataConnection);
		dataConnection.createAnswerDone = createAnswerDone.bind(dataConnection);
		dataConnection.answerLocalDescriptionDone = answerLocalDescriptionDone.bind(dataConnection);
		dataConnection.answerRemoteDescriptionDone = answerRemoteDescriptionDone.bind(dataConnection);
		dataConnection.send = send.bind(dataConnection);
		
		return dataConnection;
	}
	
	return {
		create : create
	};

})();