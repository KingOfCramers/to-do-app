const mongoose = require("mongoose");

// Define the properties of your documents in mongodDB.
// Mongoose "validators" check to ensure the properties conform to the model.
const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    _creator: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    }
}); // Mongooose automatically converts this to lowercase and pluralizes it as our collection.


module.exports = {
    Todo
}