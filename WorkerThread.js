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
			self._completes[ret.taskId](ret);
		}
	}
}

WorkerThread.prototype.run = function(task, complete){
	var _task = {__THREAD_TASK__:task.toString(), sharedObj: this.sharedObj, taskId: this._task_id};
	this._completes[this._task_id++] = complete;
	this._worker.postMessage(_task);
}
