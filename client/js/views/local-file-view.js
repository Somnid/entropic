var localFileViewProto = Object.create(HTMLElement.prototype);
localFileViewProto.createdCallback = function(){
	localFileView.create(this);
};
document.registerElement("local-file-view", {
  prototype : localFileViewProto
});

var localFileView = (function(){

	function create(localFileView){
		localFileView.dom = {};
		
		//set defaults
		localFileView.fileEntry = null;
		
		bind(localFileView);
		
		localFileView.renderShadow();
		localFileView.gatherSelectors();
		
		return localFileView;
	}
	
	function bind(localFileView){
		localFileView.gatherSelectors = gatherSelectors.bind(localFileView);
		localFileView.renderShadow = renderShadow.bind(localFileView);
	}
	
	function renderShadow(){
		var template = document.getElementById("local-file-tmpl");
		var tmpl = Tmpl.tmpl(template, { "a" : "fileEntry.name" }, this);
		var localFileLink = tmpl.querySelector("a");
		if(this.fileEntry){
			localFileLink.href = this.fileEntry.toURL(); //enhance with attrs
		}
		this.dom.shadowRoot = this.createShadowRoot();
		this.dom.shadowRoot.appendChild(tmpl);
	}
	
	function gatherSelectors(){
	}

	return {
		create : create
	};

})();