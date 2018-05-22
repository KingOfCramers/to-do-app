const { ObjectID } = require("mongodb");
const { mongoose } = require("../server/db/mongoose");
const { Todo } = require("../server/models/todo");
const { User } = require("../server/models/user");

var userid = '5b04936ebceab4eae19614c1';
var id = '5b00abd0c112d97f09cf7565';
var fakeId = '5b00abdac110d97f09cf7565';
var invalidId = "a8pawunidfja";

/// VALID SEARCHES ///

/*
// Find returns all of the matches in an array.
Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos: ', todos);
})

// findOne returns the first match, as a single object.
Todo.findOne({
    _id: id
}).then((todos) => {
    console.log('Todo: ', todos);
})

// findById is a simpler version of the findOne, returns a single document.
Todo.findById(id).then((todo) => console.log(todo));

*/

/// INVALID SEARCHES ///

/*
Todo.find({
    _id: fakeId
}).then((todos) => {
    console.log('find: ', todos); // empty array
})

Todo.findOne({
    _id: fakeId
}).then((todos) => {
    console.log('findOne: ', todos); // null
})

Todo.findById(fakeId).then((todo) => console.log("findById: ", todo)); // null


// If the Id isn't valid at all, we need to handle it with a catch. Or we can use the ObjectID property on the mongoose module to check it before querying our database.

if(ObjectID.isValid(invalidId)) {
    console.log("ID Not valid.")
} else {

Todo.findById(invalidId).then((todos) => {
    console.log('findByIdInvalid: ', todos);
}).catch((e) => console.log('findByIdInvalid: ', e)); // null

}

// Full example
if(!ObjectID.isValid(userid)){
    console.log("Invalid ID.")
} else {
    User.findById(userid).then((user) => {
        if(!user){ // Will return false
            return console.log("User not found.")
        }
        console.log(user)
    }).catch((e) => {
        console.log("Error: ", e)
    })
} */
