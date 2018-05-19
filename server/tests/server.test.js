const expect = require("expect");
const supertest = require("supertest");

const { app } = require("../server.js");
const { Todo } = require("../models/todo");

// Dummy data of todos.
const todos = [{
    text: "First test todo"
}, {
    text: "Second test todo"
}]

// This function runs before every test case.
beforeEach((done) => {
    Todo.remove({}).then(() => {  // Empties database.
        return Todo.insertMany(todos) // Inserts dummy data (to ensure GET requests works).
        }).then(() => done());
});

describe("POST /todos", () => {
    it("Should POST a new todo", (done) => {
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
                Todo.find({text: text}).then((todos) => { // Returns array of only item where text is "This is a test"
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done(); // Call done to end the checks.
                }).catch((e) => done(e));
            }) // Instead of passing done, we use a function
    });

    it("Should not POST todo with invalid body data", (done) => {
        supertest(app)
            .post("/todos")
            .send({})
            .expect(400)
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
});

describe("GET /todos", () => {
    it("Should GET all todos", (done) => {
        supertest(app)
            .get("/todos")
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    })
})