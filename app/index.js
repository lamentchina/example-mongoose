'use strict';
var koala = require('koala')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , uuid = require('node-uuid')
  , Binary = mongoose.Types.Buffer.Binary
  ;

var app = koala();
mongoose.connect('mongodb://127.0.0.1/test');
var UsersSchema = new Schema({
  id: {
    type: Buffer
    , index: true
  }
  , userName: {
    type: String,
    index: true,
    required: true,
    unique: true
  },
  email: {
    type: String,
    index: true,
    required: true
  },
  status: Number,
  lastLoginAt: Date
});


// var model_name = coll_name = 'example';
// mongoose.model(model_name, ExampleSchema, coll_name);
// var EXAMPLE = mongoose.model(model_name, coll_name);
// var example = new EXAMPLE();
// example.user_id = new Binary(uuid.v4(), 4);
// example.username = 'alex';
// example.save(function(err) {
//   if (err) {
//     console.log('save failed');
//   } else
//     console.log('save success');
// });

UsersSchema.statics.add = function (obj) {
  this.create({
    id: new Binary(uuid.v4(), 4)
    , userName: obj.userName
    , email: obj.email
  }).save();
};

module.exports = mongoose.model('Users', UsersSchema);

// app.use(function *(){
//   console.log('save success ~ ')
//   // yield this.model('Users').add({ userName: 'tom', email:'admin@javapk.net'});
// });

// app.use(function *(next) {
//   // var user = yield redisClient.hgetall('user:' + req.cookies.get('user_id'));
//   // this.user = user;
//   yield next();
// });
app.use(function *() {
  console.log(require('Users'))
  // yield this.model('Users').add({ userName: 'tom', email:'admin@javapk.net'});
  var model_name = 'example_app'
    , coll_name = 'example_app';
  mongoose.model(model_name, UserSchema, coll_name);
  var EXAMPLE = mongoose.model(model_name, coll_name);
  var example = new EXAMPLE({
    id: new Binary(uuid.v4(), 4)
    , userName: 'tom'
    , email: 'admin@javapk.net'
  }).save();

  console.log('save loading....')
  this.body = 'this.user.name';
});



app.listen(9500);
