//REQUIRE 

MongoDB = require('mongodb')
EventEmitter = require('events')
express = require('express')
bodyparser = require('body-parser')
http = require('http')

//START THE SERVER AND LISTEN
app = express()
server = http.createServer(app)
io = require("socket.io")(server)
server.listen(3000);
app.use(express.static(__dirname + "/public"));
app.use(bodyparser.json());


//DB URLS
oplogurl = 'mongodb://shiv:abc123@candidate.51.mongolayer.com:10891,candidate.61.mongolayer.com:10219/local?authSource=socialcops&replicaSet=set-567410798260cb6677000ce4'
dburl = 'mongodb://shiv:abc123@candidate.51.mongolayer.com:10891,candidate.61.mongolayer.com:10219/socialcops?replicaSet=set-567410798260cb6677000ce4'


//CONNECT TO DB ONCE AND REUSE CONNECTION
var db;
MongoDB.MongoClient.connect(dburl, function(err, database){
  if(err) {console.log("error", err)}
  else{
      db = database;
  }
})

// SERVER REQUESTS----------------------------------------------------------------------
app.get('/gossipgirl', function(req, res){
  console.log("I received a GET request");
    db.collection('gossipgirls').find({}).toArray().then(function(arr){
    res.json(JSON.stringify(arr));
  })  
});

app.post('/gossipgirl', function(req, res){
  console.log("I received a post request");
    db.collection('gossipgirls').insert(req.body, function(err, doc){
    res.json(doc);
  })
});

app.delete('/gossipgirl/:id', function(req, res){
  console.log("I received a del request");
  id = req.params.id
  console.log(id);
  db.collection('gossipgirls').remove({"_id": MongoDB.ObjectId(id)}, function(err, doc){
      console.log(doc);
      res.json(doc);
  })
});

app.get('/gossipgirl/:id', function(req, res){
  console.log("I received a update request");
  id = req.params.id
    db.collection('gossipgirls').findOne({"_id": MongoDB.ObjectId(id)}, function(err, doc){
      res.json(doc);
  })
});

app.put('/gossipgirl/:id', function(req, res){
  console.log("I received a Update request");
  id = req.params.id;
  db.collection('gossipgirls').findAndModify(
      {"_id": MongoDB.ObjectId(id)}, 
      [['_id','asc']],
      {$set: {name: req.body.name, location: req.body.location}},
      {new : true},  
      function(err, doc){
        res.json(doc)
        }
  )})
//--------------------------------------------------------------------------------------

//HEART OF OUR NOTIFICATION SYSTEM-----------------------------------------------

//OPLOG REUESTS HERE AND SOCKET MESSAGES------------------------------------------------
  MongoDB.MongoClient.connect(oplogurl, function(err, db) {  
    // Get to oplog collection
      db.collection('oplog.rs').find({}, {"sort": [["$natural", -1]]})
        .toArray()
        .then(function(arr){
            last_ts = arr[0].ts.high_;
            cursor = db.collection('oplog.rs').find({'ts': { "$gte" : MongoDB.Timestamp(1, last_ts) } }, {tailable:true, awaitData:true, oplogReplay: true, numberOfRetries: -1} );
            IntervalEach(200, cursor, function(err, item) {
                if(item != null) {
                  console.log(item);
                  if(item.op === 'u')
                  {
                    io.sockets.emit('dataChanged', {Operation: "Update", Details: JSON.stringify(item.o['$set'])}); 
                  }
                  else
                  {
                    var op = ""
                    if(item.op == 'i') op = "Insert"
                    else if(item.op == 'd') op = "Delete"
                    io.sockets.emit('dataChanged', {Operation: op, Details: JSON.stringify(item.o)}); 
                  }
            }});

            function IntervalEach(interval, cursor, callback) {
                if (!callback) {
                    throw new Error("callback is mandatory");
                }
                setTimeout(function(){
                    // Fetch the next object until there is no more objects
                    cursor.nextObject(function(err, item) {        
                        if(err != null) callback(err, null);

                        if(item != null) {
                            callback(null, item);
                        } 
                        IntervalEach(interval, cursor, callback);
                        });
                      }, interval);
                  };                
        });
  });   
