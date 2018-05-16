const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", { useNewUrlParser: true }, (err,client) => {
    if(err){
        return console.log("Unable to connect");
    }

    console.log("Connected to MongoDB Server");
    const db = client.db("TodoApp"); // Name of database

/*    // deleteMany
    db.collection("Todos").deleteMany({name: "Harrison"}).then((result) => {
        console.log(result);
    })

    // deleteOne
    db.collection("Todos").deleteOne({ name: "Mike"}).then((result) => {
        console.log(result);
    })

    // findOneAndDelete
    db.collection("Todos").findOneAndDelete({ age: 24}).then((result) => {
        console.log(result);
        console.log(result.value); // returns the document itself.
    })
    */

     // findOneAndDelete
    db.collection("Todos").findOneAndDelete({
        _id: new ObjectID("5afb72b0a579bc429450c53e")
    }).then((result) => {
        console.log(result);
        console.log(result.value); // returns the document itself.
    })

    client.close();
});