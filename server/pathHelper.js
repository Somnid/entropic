function getExtension(path){
	var pathSplit = path.split(".");
	if(pathSplit.length == 1){
		return "";
	}
	return pathSplit[pathSplit.length - 1];
}

exports.getExtension = getExtension;