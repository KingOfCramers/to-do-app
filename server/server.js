const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("./db/mongoose");
const { ObjectID } = require("mongodb");
const { User } = require("./models/user");
const { Todo } = require("./models/todo");

const port = 3000;
const app = express();

app.use(bodyParser.json()); // Middlewear. Sets our headers to JSON.


app.post("/todos", (req,res) => {
    // Upon a POST method to /todos Url, get the body of the request, and get the text value. Use that to create a new todo based on our mongo model.
    const todo = new Todo({
        text: req.body.text
    });

    // Call the save method on our mongoose model to add it to the database.
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get("/todos", (req,res) => {
    Todo.find().then((todos) => {
        res.send({ // By using an object, we can add other information...
            todos: todos
        });
    }, (e) => {
        res.status(400).send(e);
    })  // Returns all Todos.
});

app.get("/todos/:todo", (req,res) => {
    // The id property here is passed under req.params.id
    let id = req.params.todo;
    if(!ObjectID.isValid(id)){
        return res.status(404).send(); // Pass nothing back.
    }

    Todo.findById(id).then((todo) => {
        if(!todo){
            return res.status(404).send("Not found."); // Pass nothing back.
        }
        res.status(200).send({
            todo: todo
        }); // Sets up todo property on response object.
    }).catch((e) => { // Fires w/ server interruption.
        res.status(400).send();
        console.log(e);
    });
});


app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

// Export app for testing purposes.
module.exports = { app };