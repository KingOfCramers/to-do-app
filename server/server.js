const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("./db/mongoose");
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

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

// Export app for testing purposes.
module.exports = { app };