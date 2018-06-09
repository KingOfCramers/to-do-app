const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash"); // Working with arrays, objects, strings, etc.
const { ObjectID } = require("mongodb");
const { User } = require("./models/user");
const { Todo } = require("./models/todo");
const bcrypt = require("bcryptjs");

const config = require("./config/config"); // Get current environment.
const { mongoose } = require("./db/mongoose"); // Connect to mongoose database

const { authenticate } = require("./middleware/authenticate");

const port = process.env.PORT;
const app = express();

app.use(bodyParser.json()); // Middlewear. Sets our headers to JSON.

////////////////
//// TODOS /////
////////////////


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

app.delete("/todos/:todo", (req,res) => {
    let id = req.params.todo;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.patch("/todos/:id", (req,res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']); // Creates an object using the properties passed into the array. We don't want user to be able to update whatever they want.
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) { // if a boolean and true
        body.completedAt = new Date().getTime(); // Returns javascript timestamp.
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    // We've already generated the body object. New, true returns the new todo.
    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo})
    }).catch((e) => {
        res.status(400).send();
    })

});


////////////////
//// USERS /////
////////////////

app.post("/users", (req,res) => {
    var body = _.pick(req.body, ['email', 'password']); // Creates an object using the properties passed into the array.

    var user = new User(body); // Create a new instance using the User model.

    user.save().then(() => {
        return user.generateAuthToken(); // Call instance method
    }).then((token) => {
        res.header('x-auth', token).send(user); // Set our headers
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get("/users/me", authenticate, (req,res) => { // // Find associated user w/ token
    res.send(req.user);
});

app.post("/users/login", (req,res) => {
    var { email, password } = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(email,password).then((user) => {
        user.generateAuthToken().then((token) => { // Generate token for logged in user.
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send(); // Comes from rejected promise in User.findByCredentials method.
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

// Export app for testing purposes.
module.exports = { app };