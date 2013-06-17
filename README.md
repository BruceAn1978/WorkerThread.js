# WorkerThread.js

WorkerThread.js is a lightweight multi-thread lib that allow jsers to write code run between workers and main thread.

# Docs & Examples
		
	```js
	///there is two ways to do task on work thread
	var t1 = new WorkerThread({i: 100} /*shared obj*/);

	///1. use setInterval
	setInterval(function(){
		t1.run(function(sharedObj){
				return sharedObj.i++;
			},
			function(r){
				console.log("t1>" + r.returnValue + ":" + r.error);
			}
		);
	}, 500);

	var t2 = new WorkerThread({i: 50});
	
	///2. use sleep
	t2.run(function(sharedObj){	
		while(this.threadSignal){
			sharedObj.i++;

			this.runOnUiThread(function(sharedObj){
				///you can interact with dom here
				W("body ul").appendChild("<li>"+sharedObj.i+"</li>");
			});
			
			this.sleep(500);
		}
		return sharedObj.i;
	}, function(r){
		window.console && console.log("t2>" + r.returnValue + ":" + r.error);
	});

	```
