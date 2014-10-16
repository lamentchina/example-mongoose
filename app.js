var http = require('http')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema;
http.createServer(function(requeset, response) {
  response.writeHead(200, {
    "Content-Type": 'text/plain'
  });
  response.end('Hellow MongoDB\n'+mongoose);
}).listen(9500);
console.log('Server running at http://127.0.0.1:9500/');

mongoose.connect('mongodb://127.0.0.1/test');
var ExampleSchema = new Schema({
  user_id: {type:Number, index:true}
  , username: {type: String}
});
var model_name = coll_name = 'example';
mongoose.model(model_name, ExampleSchema, coll_name);
var EXAMPLE = mongoose.model(model_name, coll_name);
var example = new EXAMPLE();
example.user_id = 1;
example.username = 'stepock';
example.save(function(err){
  if(err){
    console.log('save failed');
  }
  console.log('save success');
});
