const { MongoClient, ObjectID } = require("mongodb");

// https://docs.mongodb.com/manual/reference/operator/update/
MongoClient.connect("mongodb://localhost:27017/TodoApp", (err,client) => {
    if(err){
        return console.log("Could not connect");
    }
    const db = client.db("TodoApp");
    console.log("Connected to MongoDB Server.")
    // filter option, update option
    db.collection("Todos").findOneAndUpdate({
        _id: new ObjectID("5af90b2758baf6e1afc7e0ed")
    }, {
        $set: {
            name: "Jacob"
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });

    client.close();

})