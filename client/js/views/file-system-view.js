var FileSystemView = (function(){

	function create(fileSystemView){
		fileSystemView.dom = {};
		fileSystemView.remoteFileTmpl = document.getElementById("remote-file-tmpl");
		fileSystemView.localFileTmpl = document.getElementById("local-file-tmpl");
		
		bind(fileSystemView);
		
		fileSystemView.renderShadow();
		fileSystemView.gatherSelectors();
		
		return fileSystemView;
	}
	
	function bind(fileSystemView){
		fileSystemView.gatherSelectors = gatherSelectors.bind(fileSystemView);
		fileSystemView.remoteFileAdd = remoteFileAdd.bind(fileSystemView);
		fileSystemView.localFileAdd = localFileAdd.bind(fileSystemView);
		fileSystemView.renderShadow = renderShadow.bind(fileSystemView);
	}
	
	function renderShadow(){
		var template = document.getElementById("file-system-view-tmpl");
		var tmpl = Tmpl.tmpl(template, { }, this);
		this.dom.shadowRoot = this.createShadowRoot();
		this.dom.shadowRoot.appendChild(tmpl);
	}
	
	function gatherSelectors(){
		this.dom.remoteFiles = this.dom.shadowRoot.querySelector(".remote-files-list");
		this.dom.localFiles = this.dom.shadowRoot.querySelector(".local-files-list");
	}
	
	function remoteFileAdd(data){
		var tmpl = Tmpl.tmpl(this.remoteFileTmpl, data, { "a" : "name" });
		var remoteFileLink = tmpl.querySelector("a");
		remoteFileLink.dataset.remoteId = data.name; //enhance with attrs
		this.dom.remoteFiles.appendChild(remoteFile);
	}
	
	function localFileAdd(fileEntry){
		var localFileView = document.createElement("local-file-view");
		localFileView.fileEntry = fileEntry;
		this.dom.localFiles.appendChild(localFileView);
	}

	return {
		create : create
	};

})();

var fileSystemViewProto = Object.create(HTMLElement.prototype);
fileSystemViewProto.createdCallback = function(){
	FileSystemView.create(this);
};
document.registerElement("file-system-view", {
  prototype : fileSystemViewProto
});