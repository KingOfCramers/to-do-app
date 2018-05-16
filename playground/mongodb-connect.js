// const MongoClient = require("mongodb").MongoClient;
const { MongoClient } = require("mongodb")

/*MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, client) => {
    if(err){
        return console.log("Unable to connect."); // Stops the function execution.
    }
    console.log("Connected to MongoDB server");
    const db = client.db("TodoApp"); // Name of the database.

    db.collection("Todos").insertOne({ // Use insertOne method to insert a new document into the collection. If the collection does not exist, create it.
        text: "Something to do",
        completed: false
    }, (err,results) => {
        if(err){
            return console.log("Could not insert record.")
        }

        console.log("Record added: \n", JSON.stringify(results.ops, undefined, 2)) // results.ops is all of the documents that were added (in this case, just 1).
    });

    client.close();
});
*/

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err,client) => {
    if(err){
        return console.log("Unable to connect");
    }

    console.log("Connected to MongoDB Server");
    const db = client.db("TodoApp"); // Name of database

    db.collection("Users").insertOne({
        name: "Harrison",
        age: 24,
        location: "Washington D.C."
    }, (err,results) => {
        if (err){
            return console.log("Unable to insert user: ", err);
        }

    console.log("Record added: \n", results.ops[0]._id.getTimestamp());
    // The content of the record can be accessed through the .ops method.
    // The ._id also contains the timestamp, which can be accessed using the getTimestamp() method.
    console.log(JSON.stringify(results.ops, undefined, 2));

    });

    client.close();

});