var express = require('express');
var router = express.Router();

// https://stackoverflow.com/questions/17545311/correct-way-to-search-for-mongodb-entries-by-id-in-node
var ObjectId = require('mongodb').ObjectID;


// Run this inside a mongodb shell to restore the json backup
// db.uniDataModules.insert([{}, {}, {}]);
// [{}, {}, {}]  is the contents of the modules.json

/* GET home page. */
router.get('/', function(req, res, next) {

  // Connect to the database
  const MongoClient = require('mongodb').MongoClient;
  // WARNING: database username and password vunerability
  const uri = "mongodb+srv://mudassir:MGigATCjsuW3VL7@cluster0-kahbg.mongodb.net/test?retryWrites=true";
  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("UniDash").collection("uniDataModulesNew");
     // perform actions on the collection object

     // get the whole database as a json
     modulesCollection = collection.find().toArray(function(err, docs) {

       // docs parameter has our returned query


       res.render('index', {
         title: 'UniDash: Semester 2 Gameplan',
         weekNo: 10,
         uniDashJSON: JSON.stringify(docs)
       });

     });

    client.close();
  });



});

// Add new event
router.get('/new/event/', function(req, res, next){

  // Get data from request
  /* WARNING: Possible database-vunerability here. */
  var moduleToMatch = req.query.moduleCode;

  console.log(moduleToMatch);

  var deadline = {
    time: req.query.deadlineTime,
    date: req.query.deadlineDate,
    location: req.query.deadlineLocation
  };

  var type = req.query.courseworkType;

  var weekNo = req.query.courseworkWeekNumber;

  var description = req.query.description;

  var completed = req.query.completed;

  // Connect to the database
  const MongoClient = require('mongodb').MongoClient;
  // WARNING: database username and password vunerability
  const uri = "mongodb+srv://mudassir:MGigATCjsuW3VL7@cluster0-kahbg.mongodb.net/test?retryWrites=true";
  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("UniDash").collection("uniDataModulesNew");
     // perform actions on the collection object

     // Add event to database
     collection.updateOne(
       { moduleCode: moduleToMatch },
       { $push: {

           events: {
             _id: ObjectId(),
             type: type,
             weekNo: weekNo,
             deadline: deadline,
             description: description,
             completed: completed
           }

         }
       }
     );

    client.close();
  });

  // Renders a default success page
  res.render('success', {
    message: 'The event has been added!'
  });

});

// Update an event
router.get('/update/event/', function(req, res, next){

  // Get data from request
  /* WARNING: Possible database-vunerability here. */
  var moduleToMatch = req.query.moduleCode;

  var eventIDToUpdate = req.query.id;

  console.log(moduleToMatch);

  var deadline = {
    time: req.query.deadlineTime,
    date: req.query.deadlineDate,
    location: req.query.deadlineLocation
  };

  var type = req.query.courseworkType;

  var weekNo = req.query.courseworkWeekNumber;

  var description = req.query.description;

  var completed = req.query.completed;

  // Connect to the database
  const MongoClient = require('mongodb').MongoClient;
  // WARNING: database username and password vunerability
  const uri = "mongodb+srv://mudassir:MGigATCjsuW3VL7@cluster0-kahbg.mongodb.net/test?retryWrites=true";
  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("UniDash").collection("uniDataModulesNew");
     // perform actions on the collection object

     // Docs for mongodb https://docs.mongodb.com/manual/reference/operator/update/positional/#up._S_

     // Add event to database given the _id
     collection.updateOne(
       {'events._id': ObjectId(eventIDToUpdate)},
       { $set: {
         'events.$.type': type,
         'events.$.weekNo': weekNo,
         'events.$.deadline': deadline,
         'events.$.description': description,
         'events.$.completed': completed
        }
       }
     );

    client.close();
  });

  // Renders a default success page
  res.render('success', {
    message: 'The event has been added!'
  });

});

// Delete an event given the _id of the event.
router.get('/delete/event/', function(req, res, next){

  // Get data from request
  /* WARNING: Possible database-vunerability here. */
  var moduleToMatch = req.query.moduleCode;
  var eventIDToDelete = req.query.id;

  // Connect to the database
  const MongoClient = require('mongodb').MongoClient;
  // WARNING: database username and password vunerability
  const uri = "mongodb+srv://mudassir:MGigATCjsuW3VL7@cluster0-kahbg.mongodb.net/test?retryWrites=true";
  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("UniDash").collection("uniDataModulesNew");
     // perform actions on the collection object

     // Delete event element from database
     collection.updateOne(
       {'moduleCode': moduleToMatch},
       {$pull: {
         'events': {'_id': ObjectId(eventIDToDelete) } }
       }
     );

    client.close();
  });

  // Renders a default success page
  res.render('success', {
    message: 'The event has been deleted successfully!'
  });

});


/* GET dump page. */
router.get('/dump', function(req, res, next) {


  // Connect to the database
  const MongoClient = require('mongodb').MongoClient;
  // WARNING: database username and password vunerability
  const uri = "mongodb+srv://mudassir:MGigATCjsuW3VL7@cluster0-kahbg.mongodb.net/test?retryWrites=true";
  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("UniDash").collection("uniDataModulesNew");
     // perform actions on the collection object

     // get the whole database as a json
     modulesCollection = collection.find().toArray(function(err, docs) {

       // docs parameter has our returned query


       res.render('dump', {
         title: 'JSON Dump',
         weekNo: 3,
         uniDashJSON: JSON.stringify(docs)
       });

     });

    client.close();
  });

});


// GET edit page
router.get('/edit/', function(req, res, next) {

  // Get the id of the event
  var id = req.query.id;

  // Get the event data from the database

  // Connect to the database
  const MongoClient = require('mongodb').MongoClient;

  // WARNING: database username and password vunerability
  const uri = "mongodb+srv://mudassir:MGigATCjsuW3VL7@cluster0-kahbg.mongodb.net/test?retryWrites=true";

  const client = new MongoClient(uri, { useNewUrlParser: true });

  client.connect(err => {

    const collection = client.db("UniDash").collection("uniDataModulesNew");

      // get the whole database as a json
      modulesCollection = collection.find({events: {_id: id}}).toArray(function(err, docs) {

      // The docs parameter has our result of the performed query

      // Pass the data to the 'edit.ejs' file for rendering
      res.render('edit', {
        eventJSON: JSON.stringify(docs)
      });

    });

    client.close();
  });

});

module.exports = router;
