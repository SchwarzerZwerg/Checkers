var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:2070/team-d";

MongoClient.connect(url, function(err, db))
{
    if(err) throw err;
    var dbo = db.db("team-d");
    var myobj = [{name: "Max Mustermann", score: "0"}];
    var sort = {score: 1};
    console.log("Datbase created!");
    dbo.createCollection("score");
    dbo.collection("score").insertOne(myobj, function(err, res))
    {
        if(err) throw err;
        conlose.log("Datenbank auf neustem Stand");
    }
    dbo.collection("score").find().sort(sort).toArray(function(err, res))
    {
        if(err) throw err;
    }
    db.close();
    });
});