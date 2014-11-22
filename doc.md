什么是Mongoose?

Mongoose是基于node-mongodb-native开发的MongoDB nodejs驱动，可以在异步的环境下执行。

如何安装Mongoose?


npm install mongoose



如何使用Mongoose?


test.js代码：


var mongoose = require('mongoose')

  , Schema = mongoose.Schema



mongoose.connect('mongodb://localhost/test');



var TestSchema = new Schema({

   user_id        : {type : Number, index : true}

  ,username       : {type : String}

});



var model_name = coll_name = 'taobao';

mongoose.model(model_name, TestSchema, coll_name);



var TAOBAO  = mongoose.model(model_name, coll_name);

var taobao  = new TAOBAO();

taobao.user_id  = 1;

taobao.username = 'xuanhou';

taobao.save(function(err) {

  if (err) {

    console.log('save failed');

  }

  console.log('save success');

});


执行test.js


node test.js

查看是否执行成功：


xuanhou.ysh[@XXXX test]$ mongo

MongoDB shell version: 1.8.0

connecting to: test

> show collections

system.indexes

taobao

> db.taobao.find()

{ "_id" : ObjectId("4db65fafcb4312401d000001"), "user_id" : 1, "username" : "xuanhou" }

> exit

bye

为什么还要基于node-mongodb-native开发mongoose呢？

下面是node-mongodb-native实现的代码相信能让你了解为什么很多人选择Mongoose（callback层数太多）:



var client = new Db('integration_tests_20', new Server("127.0.0.1", 27017, {}));

  client.open(function(err, p_client) {

        client.createCollection('test_insert', function(err, collection) {

          client.collection('test_insert', function(err, collection) {

            for(var i = 1; i < 1000; i++) {

              collection.insert({c:1}, function(err, docs) {});

            }



            collection.insert({a:2}, function(err, docs) {

              collection.insert({a:3}, function(err, docs) {

                collection.count(function(err, count) {

                  test.assertEquals(1001, count);

                  // Locate all the entries using find

                  collection.find(function(err, cursor) {

                    cursor.toArray(function(err, results) {

                      test.assertEquals(1001, results.length);

                      test.assertTrue(results[0] != null);



                      // Let's close the db

                      client.close();

                    });

                  });

                });

              });

            });

          });

        });

  });


目前Mongoose的开发情况如何？

Mongoose已经实现了大部分功能，但还有些Mongodb提供的feature没有实现，所以也给使用者提供了打补丁的机会，下面是我最近给Mongoose打的两个补丁：

让mongoose支持distinct操作


Index: model.js

===================================================================

--- model.js    (revision 12218)

+++ model.js    (working copy)

@@ -492,6 +492,34 @@

};



/

+  distinct values for key

+

+  @param {String} key

+  @param {Object} conditions

+  @param {Function} optional callback

+  @api public

+ */

+

+Model.distinct = function (key, conditions, callback) {

+  if ('function' == typeof conditions) {

+    callback = conditions;

+    conditions = {};

+  }

+  var query = new Query(conditions, key).bind(this, 'distinct');

+  if ('undefined' == typeof callback)

+    return query;

+  var cQuery;

+  if (cQuery = this._cumulativeQuery) {

+    merge(query._conditions, cQuery._conditions);

+    if (query.options && cQuery.options)

+      merge(query.options, cQuery.options);

+    delete this._cumulativeQuery;

+  }

+  if (!query.model) query.bind(this, 'distinct');

+  return query.distinct(callback);

+};

+

+/

 where enables a very nice sugary api for doing your queries.

 For example, instead of writing:

     User.find({age: {$gte: 21, $lte: 65}}, callback);

Index: query.js

===================================================================

--- query.js    (revision 12218)

+++ query.js    (working copy)

@@ -11,6 +11,10 @@



function Query (criteria, options) {

options = this.options = options || {};

+  if ('string' == typeof options) {

+    this._key = options;

+    options = this.options = {};

+  }

this.safe = options.safe

this._conditions = {};

if (criteria) this.find(criteria);

@@ -730,6 +734,24 @@

};



/**

+  Casts this._conditions and sends a distinct

+  command to mongodb. Invokes a callback upon

+  receiving results.

+

+  @param {Function} callback fn(err, cardinality)

+  @api public

+ /

+Query.prototype.distinct = function (callback) {

+  this.op = 'distinct';

+  var model = this.model;

+  this.cast(model);

+  var castQuery = this._conditions;

+  var key = this._key;

+  model.collection.distinct(key, castQuery, callback);

+  return this;

+};

+

+/*

 Casts the query, sends the update command to mongodb.

 If there is an error, the callback handles it. Otherwise,

 we just invoke the callback whereout passing it an error.


让$gt/$gte/$lt/$lte等操作支持字符串参数


Index: string.js

===================================================================

--- string.js    (revision 12218)

+++ string.js    (working copy)

@@ -139,10 +139,15 @@

}



SchemaString.prototype.$conditionalHandlers = {

-    '$ne': handleSingle

+    '$lt': handleSingle

+  , '$lte': handleSingle

+  , '$gt': handleSingle

+  , '$gte': handleSingle

+  , '$ne': handleSingle

, '$in': handleArray

, '$nin': handleArray

};

+

SchemaString.prototype.castForQuery = function ($conditional, val) {

var handler;

if (arguments.length === 2) {



......