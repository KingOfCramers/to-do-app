const expect = require("expect");
const supertest = require("supertest");
const { ObjectID } = require("mongodb");
const { app } = require("../server.js");
const { Todo } = require("../models/todo");
const { todos, populate } = require("./seed/seed");

// This function runs before every test case.
beforeEach(populate);

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

describe("GET /todos/:id", () => {
    it("Should return a 404 for a non-valid ID", (done) => {
        const invalidId = "thisisaninvalididz"
        supertest(app)
            .get(`/todos/${invalidId}`)
            .expect(404)
            .end(done);
    });
    it("Should return a 404 if [valid] todo not found", (done) => {
        const fakeID = new ObjectID();
        supertest(app)
            .get(`/todos/${fakeID.toHexString()}`)
            .expect(404)
            .end(done);
    });
    it("Should GET a single todo doc", (done) => {
        supertest(app)
            .get(`/todos/${todos[0]._id.toHexString()}`) // Must convert object ID to string.
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text); // Checks todo property against our fake "database" from above.
            })
            .end(done);
    });
});

describe("DELETE /todos/:id", () => {
    it("Should return a 404 for an invalid objectID", (done) => {
        const invalidId = "thisisaninvalididz"
        supertest(app)
            .delete(`/todos/${invalidId}`)
            .expect(404)
            .end(done);
    });
    it("Should return a 404 if the [valid] todo is not found", (done) => {
        const fakeID = new ObjectID();
        supertest(app)
            .delete(`/todos/${fakeID.toHexString()}`)
            .expect(404)
            .end(done);
    });
    it("Should remove a todo using the objectID", (done) => {
        var hexId = todos[1]._id.toHexString();
        supertest(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err,res) => {
                if(err){
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe("PATCH /todos/:id", () => {
    it("Should return a 404 for an invalid objectID", (done) => {
        const invalidId = "thisisaninvalididz"
        supertest(app)
            .patch(`/todos/${invalidId}`)
            .expect(404)
            .end(done);
    });
   it("Should return a 404 if the [valid] todo is not found", (done) => {
        const fakeID = new ObjectID();
        supertest(app)
            .patch(`/todos/${fakeID.toHexString()}`)
            .expect(404)
            .end(done);
    });
   it("Should update the todo", (done) => {
        var hexId = todos[1]._id.toHexString();
        var newText = "New Text here"
        supertest(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text: newText
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
                expect(res.body.todo.text).toBe(newText);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toExist().toBeA('number');
            })
            .end(done);
    });
    it("Should clear completedAt when todo is set to incomplete", (done) => {
        var hexId = todos[1]._id.toHexString();
        supertest(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done)
    })
});