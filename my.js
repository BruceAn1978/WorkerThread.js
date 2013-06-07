onmessage = function(evt){
	var data = evt.data;
	data.id++;
	postMessage(data);
}