var FileSystem = (function(){

	function createFileSystem(grantedBytes){
		webkitRequestFileSystem(PERSISTENT, this.size, this.fileSystemCreated, error);
	}

	function fileSystemCreated(fs){
		this.fs = fs;
		this.onCreated();
	}
	
	function addFile(file, name, success){
		success = success || noop;
		this.fs.root.getFile(name, { create: true, exclusive: true }, writeFile, error);
		
		function writeFile(fileEntry){
			fileEntry.createWriter(function(fileWriter){
				fileWriter.write(file);
				success(fileEntry)
			}, error);
		}
	}
	
	function getAllFiles(success){
		var files = [];
		var dirReader = this.fs.root.createReader();
		dirReader.readEntries(function(results){
			if(results.length == 0){
			}else{
				for(var i = 0; i < results.length; i++){
					files.push(results[i]);
				}
				success(files);
			}
		}, error);
	}
	
	function error(error){
		console.error(error);
	}
	
	function noop(){
	}

	function create(options){
		var fileSystem = {};
		fileSystem.size = options.size || 10 * 1024 * 1024;
		
		fileSystem.onCreated = options.onCreated || noop;
		
		fileSystem.createFileSystem = createFileSystem.bind(fileSystem);
		fileSystem.fileSystemCreated = fileSystemCreated.bind(fileSystem);
		fileSystem.addFile = addFile.bind(fileSystem);
		fileSystem.getAllFiles = getAllFiles.bind(fileSystem);
		
		navigator.webkitPersistentStorage.requestQuota(options.size, fileSystem.createFileSystem, error);
		
		return fileSystem;
	}
	
	return {
		create : create
	};

})();