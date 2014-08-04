var SavedField = (function(){

	function init(el){
		var key = window.location.href + "-" + el.id;
		el.value = localStorage.getItem(key);
		if(el.tagName.toLowerCase() == "select"){
			el.addEventListener("change", setItem, false);
		}else{
			el.addEventListener("input", setItem, false);
		}
	}

	function setItem(e){
		var el = e.target;
		var key = window.location.href + "-" + el.id;
		localStorage.setItem(key, el.value)
	}
	
	return {
		init : init
	};

})();