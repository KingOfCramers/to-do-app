const { ObjectID } = require("mongodb");
const { Todo } = require("../../models/todo");
const { User } = require("../../models/user");
const jwt = require("jsonwebtoken");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: "example@example.com",
    password: "useronepass",
    tokens: [{
        access: "auth",
        token: jwt.sign({ _id: userOneId, access: 'auth'}, "abc123").toString()
    }]
}, {
    _id: userTwoId,
    email: "exampletwo@example.com",
    password: "usertwopass"
}];

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

const populateUsers = (done) => {
    User.remove({}).then(() => {  // Empties database.
        var userOne = new User(users[0]).save(); // Save the first user.
        var userTwo = new User(users[1]).save(); // Save #2 (returns promise)

        return Promise.all([userOne, userTwo]).then(() => done());
    });
}

module.exports = {
    todos,
    users,
    populate,
    populateUsers
}