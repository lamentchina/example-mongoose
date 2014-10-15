var http = require('http')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema;
http.createServer(function(requeset, response) {
  response.writeHead(200, {
    "Content-Type": 'text/plain'
  });
  response.end('Hellow World\n'+mongoose);
}).listen(9500);
console.log('Server running at http://127.0.0.1:9500/');
