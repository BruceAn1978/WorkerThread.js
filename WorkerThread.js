(function(){

if(typeof exports == 'undefined'){
	window.exports = window;
}

if(!window.Worker){
	var paths = document.getElementsByTagName("script"),
		srcPath = paths[paths.length - 1].src;
	
	window.getThreadPath = function(path){
		return srcPath.replace(/[^\/]*$/, path);
	}	

 	window.Worker = function(src){
		var iframe = document.createElement("iframe");
			iframe.style.cssText = "visibility:hidden;";
			document.body.appendChild(iframe);
			var text = ['<html><head>' ,
				'<meta http-equiv="X-UA-Compatible" content="IE=edge">' ,
				'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">',
				'</head></html>'].join();
			var doc = iframe.contentWindow.document, head, script;
			doc.open();
			doc.write(text);
			doc.close();	

			var jsFile = getThreadPath(src);
			head = doc.getElementsByTagName("head")[0];
			script = doc.createElement("script");
			script.type = "text/javascript";
			script.src = jsFile;
			head.appendChild(script);

		this._win = iframe.contentWindow;
		var self = this;
		this._win.postMessage = function(msg){
			self.onmessage({data:msg});
		}
	}

	Worker.prototype.postMessage = function(msg){
		var _win = this._win, self = this;

		var timer = setInterval(function(){
			if(_win.onmessage){
				//IE兼容模式下不允许直接调用onmessage方法
				_win.onmessage2 = _win.onmessage;
				_win.onmessage2({data:msg});
				self.postMessage  = function(msg){
					_win.onmessage2({data:msg});
				}
				clearInterval(timer);
			}
		}, 100);
	}

	Worker.prototype.onmessage = function(evt){
		console.log(evt);
	}

	window.Worker = Worker;
}

function WorkerThread(sharedObj){
	this._worker = new Worker("thread.js");
	this._completes = {};
	this._task_id = 0;
	this.sharedObj = sharedObj;

	var self = this;
	this._worker.onmessage = function(evt){
		var ret = evt.data;
		if(ret.__UI_TASK__){
			//run on ui task
			var fn = (new Function("return "+ret.__UI_TASK__))();
			fn(ret.sharedObj);
		}else{
			self.sharedObj = ret.sharedObj;
			self._completes[ret.taskId] && self._completes[ret.taskId](ret);
		}
	}
}

WorkerThread.prototype.run = function(task, complete){
	var _task = {__THREAD_TASK__:task.toString(), sharedObj: this.sharedObj, taskId: this._task_id};
	this._completes[this._task_id++] = complete;
	this._worker.postMessage(_task);
}

exports.WorkerThread = WorkerThread;

})();