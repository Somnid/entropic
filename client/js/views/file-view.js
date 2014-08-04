var FileView = (function(){

	function create(options){
		var fileView = {};
		fileView.el = options.el;
		fileView.dom = {};
		fileView.remoteFileTmpl = options.remoteFileTmpl;
		fileView.localFileTmpl = options.localFileTmpl;
		
		bind(fileView);
		
		fileView.gatherSelectors();
		
		return fileView;
	}
	
	function bind(fileView){
		fileView.gatherSelectors = gatherSelectors.bind(fileView);
		fileView.remoteFileAdd = remoteFileAdd.bind(fileView);
		fileView.localFileAdd = localFileAdd.bind(fileView);
	}
	
	function gatherSelectors(){
		this.dom.remoteFiles = this.el.querySelector(".remote-files-list");
		this.dom.localFiles = this.el.querySelector(".local-files-list");
	}
	
	function remoteFileAdd(data){
		var remoteFile = document.importNode(this.remoteFileTmpl.content, true);
		var remoteFileLink = remoteFile.querySelector("a");
		remoteFileLink.dataset.remoteId = data.name;
		remoteFileLink.innerText = data.name;
		this.dom.remoteFiles.appendChild(remoteFile);
	}
	
	function localFileAdd(fileEntry){
		var localFile = document.importNode(this.localFileTmpl.content, true);
		var localFileLink = localFile.querySelector("a");
		localFileLink.href = fileEntry.toURL();
		localFileLink.innerText = fileEntry.name;
		this.dom.localFiles.appendChild(localFile);
	}

	return {
		create : create
	};

})();