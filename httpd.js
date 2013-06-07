var http = require('http');
var fs = require('fs');

var args = process.argv.splice(2);
var w = args[0] || 320,
	h = args[1] || 480;

http.createServer(function (req, res) {
  var file = req.url;
  var routers = [
    /*{
      pattern: /^\/cocos2d/i,
      replacement: "/../../../cocos2d"
    },
    {
      pattern: /^\/CocosDenshion/i,
      replacement: "/../../../CocosDenshion"
    },
    {
      pattern: /^\/extensions/i,
      replacement: "/../../../extensions"
    },   
    {
      pattern: /^\/box2d/i,
      replacement: "/../../../box2d"
    },
    {
      pattern: /^\/chipmunk/i,
      replacement: "/../../../chipmunk"
    }, */
  ];

  if(file == '/'){
  	file += 'index.html';
  }

  for(var i = 0; i < routers.length; i++){
  	var router = routers[i];
  	var pattern = router.pattern;

  	if(pattern.test(file)){
  		file = file.replace(pattern, router.replacement);
  		break;
  	}
  }

  file = '.' + file;
  console.log('load '+file);

  if(/\.png$/.test(file)){
    res.writeHead(200, {'Content-Type': 'image/png'});
  }else if(/\.html/.test(file)){
    res.writeHead(200, {'Content-Type': 'text/html'});
  }
  var content = fs.readFileSync(file);
  res.end(content);
}).listen(8000);

