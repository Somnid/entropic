var DropZone = (function(){

	function init(el, fileCallback){
		var dropZone = {
			fileCallback : fileCallback,
			el : el
		};
		el.addEventListener("dragleave", dragleave.bind(dropZone));
		el.addEventListener("dragover", dragover.bind(dropZone));
		el.addEventListener("drop", drop.bind(dropZone));
	}

	function halt(e){
		e.preventDefault();
	}
	
	function dragover(e){
		halt(e);
		e.currentTarget.classList.add("dragover");
	}
	function dragleave(e){
		halt(e);
		e.currentTarget.classList.remove("dragover");
	}
	
	function drop(e){
		halt(e);
		this.file = e.dataTransfer.files[0];
		var reader = new FileReader();
		reader.onerror = error;
		reader.onload = load.bind(this);
		reader.readAsArrayBuffer(this.file);
		e.currentTarget.classList.remove("dragover");
	}
	
	function error(e){
		console.error(e);
	}
	
	function load(e){
		this.fileCallback(this.file, e.target.result);
	}
	
	return {
		init : init
	};
	
})();