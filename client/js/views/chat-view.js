var ChatView = (function(){

	function create(options){
		var chatView = {};
		chatView.dom = {};
		chatView.el = options.el;
		
		bind(chatView);
		
		chatView.gatherSelectors();
		
		return chatView;
	}
	
	function bind(chatView){
		chatView.gatherSelectors = gatherSelectors.bind(chatView);
	}
	
	function gatherSelectors(){
		
	}

	return {
		create : create
	};

})();