// ALl of the collection methods are available here: https://docs.mongodb.com/manual/reference/method/js-collection/

const { MongoClient, ObjectID } = require("mongodb");
/*
MongoClient.connect("mongodb://localhost:27017/TodoApp", { useNewUrlParser: true }, (err,client) => {
    if(err){
        return console.log("Unable to connect");
    }

    console.log("Connected to MongoDB Server");
    const db = client.db("TodoApp"); // Name of database

    // The find method on the collection returns a mongodb cursor, which has methods like toArray. To search by ID, it's necessary to convert the string into an object ID.
    db.collection("Todos").find({
        _id: new ObjectID("5af90a0a21ac9ee40f33f66e")
    }).toArray().then((docs) => {
        console.log("Todos: ");
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log("Unable to fetch todos.")
    })

     client.close();

});*/

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err,client) => {
    if(err){
        return console.log(err);
    }

    const value = "Harrison"
    console.log("Connected to MongoDB server");
    const db = client.db("TodoApp");

    db.collection("Todos").find({ name: value}).toArray().then((docs) => {
        if(docs.length === 0){
            return console.log(`${value} was not found.`)
        }
        console.log(JSON.stringify(docs,undefined,2));
    }, (err) => {
        console.log("There was an error connecting to the database.")
    });

    client.close();

});
// MongoClient.connect("mongodb://localhost:27017/TodoApp", { useNewUrlParser: true }, (err,client) => {
//     if(err){
//         return console.log("Unable to connect");
//     }

//     console.log("Connected to MongoDB Server");
//     const db = client.db("TodoApp"); // Name of database

//    //The find method on the collection returns a mongodb cursor, which has methods like toArray to Query by the id name.
//     db.collection("Todos").count(/*Sorting info goes here*/).then((docs) => {
//         console.log(`There are ${docs} records.`);
//     }, (err) => {
//         console.log("Unable to fetch todos", err);
//     });

//     db.collection("Todos").find(/*Sorting goes here*/).count().then((count) => {
//         console.log(`Number of Todos: ${count}`);
//     }, (err) => {
//         console.log("Unable to fetch todos.")
//     });

//     client.close();
// });


