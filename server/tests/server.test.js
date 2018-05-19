const expect = require("expect");
const supertest = require("supertest");

const { app } = require("../server.js");
const { Todo } = require("../models/todo");

// This function runs before every test case.
beforeEach((done) => {
    Todo.remove({}).then(() => done()); // Empties database.
})

describe("POST /todos", () => {
    it("Should create a new todo", (done) => {
        var text = "This is a test";

        // Using supertest...
        supertest(app)
            .post("/todos") // Post request to the /todos URL
            .send({text: text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text); // This is from expect...
            })
            .end((err, res) => {
                if (err){
                   return done(err); // Stop function, print error.
                }
                // Verify the todo was added. Use the find method of the mongoose model to fetch all todos.
                Todo.find().then((todos) => { // Returns an array of our todos
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done(); // Call done to end the checks.
                }).catch((e) => done(e));
            }) // Instead of passing done, we use a function
    });
});