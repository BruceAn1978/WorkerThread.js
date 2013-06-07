
onmessage = function(evt){
	var data = evt.data;

	if(data && data.__THREAD_TASK__){
		var task = data.__THREAD_TASK__;
		try{
			var fn = (new Function("return "+task))();

			var ctx = {
				threadSignal: true,
				sleep: function(interval){
					ctx.threadSignal = false;
					setTimeout(_run, interval);
				},
				runOnUiThread: function(task){
					postMessage({__UI_TASK__:task.toString(), sharedObj:data.sharedObj});
				}
			}

			function _run(){
				ctx.threadSignal = true;
				var ret = fn.call(ctx, data.sharedObj);
				postMessage({error:null, returnValue:ret, __THREAD_TASK__:task, sharedObj:data.sharedObj, taskId: data.taskId});
			}

			_run();
		}catch(ex){
			postMessage({error:ex.toString() , returnValue:null, sharedObj: data.sharedObj});
		}
	}
}
