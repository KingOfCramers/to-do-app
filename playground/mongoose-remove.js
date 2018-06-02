const { ObjectID } = require("mongodb");
const { mongoose } = require("../server/db/mongoose");
const { Todo } = require("../server/models/todo");
const { User } = require("../server/models/user");

// Remove all docs, returns amount of data removed (not actual data)
/*Todo.remove({}).then((result) => {
    console.log(result)
});*/

// Removes one from database and returns the removed data.
Todo.findOneAndRemove({text: "remove this todo"}).then((todo) => {
    console.log(todo);
});

Todo.findByIdAndRemove("5b12133411d5f65fd3706157").then((todo) => {
    console.log(todo);
});