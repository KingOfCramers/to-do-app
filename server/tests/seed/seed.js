const { ObjectID } = require("mongodb");
const { Todo } = require("../../models/todo");

// Dummy data of todos.
const todos = [{
    _id: new ObjectID(),
    text: "First test todo"
}, {
    _id: new ObjectID(),
    text: "Second test todo",
    completed: true,
    completedAt: 333
}]

const populate = (done) => {
    Todo.remove({}).then(() => {  // Empties database.
        return Todo.insertMany(todos) // Inserts dummy data (to ensure GET requests works).
        }).then(() => done());
};

module.exports = {
    populate,
    todos
}