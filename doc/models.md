##Models

###Models are fancy constructors compiled from our Schema definitions. Instances of these models represent documents which can be saved and retreived from our database. All document creation and retreival from the database is handled by these models.

####Compiling your first model

```
var schema = new mongoose.Schema({ name: 'string', size: 'string' });

var Tank = mongoose.model('Tank', schema);
```

##Constructing documents

####Documents are instances of our model. Creating them and saving to the database is easy:

```
var Tank = mongoose.model('Tank', yourSchema);

var small = new Tank({ size: 'small' });

small.save(function (err) {

  if (err) return handleError(err); // saved!

})
```

// or

```
Tank.create({ size: 'small' }, function (err, small) {

  if (err) return handleError(err); // saved!

})
```

###Note that no tanks will be created/removed until the connection your model uses is open. In this case we are using mongoose.model() so let's open the default mongoose connection:

```
mongoose.connect('localhost', 'gettingstarted'); ##Querying
```

###Finding documents is easy with Mongoose, which supports the rich query syntax of MongoDB. Documents can be retreived using each models find, findById, findOne, or where static methods.

```
Tank.find({ size: 'small' }).where('createdDate').gt(oneYearAgo).exec(callback);
```

####See the chapter on querying for more details on how to use the Query api.

##Removing

###Models have a static remove method available for removing all documents matching conditions.

```
Tank.remove({ size: 'large' }, function (err) {

    if (err) return handleError(err); // removed!

});
```

##Updating

###Each model has its own update method for modifying documents in the database without returning them to your application. See the API docs for more detail.

If you want to update a single document in the db and return it to your application, use findOneAndUpdate instead.

http://mongoosejs.com/docs/models.html
