var Util = (function(){

	function getWebSocketUrl(){
		var url = window.location.href;
		return url.replace("http://", "ws://");
	}
	
	return {
		getWebSocketUrl : getWebSocketUrl
	};

})();