const expect = require("expect");
const supertest = require("supertest");
const { ObjectID } = require("mongodb");
const { app } = require("../server.js");
const { Todo } = require("../models/todo");
const { users, todos, populate, populateUsers } = require("./seed/seed");
const { User } = require("../models/user");

// This function runs before every test case.
beforeEach(populate);
beforeEach(populateUsers);

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
    });
});

describe("GET /users/me", function() {
    it("Should return user if authenticated", (done) => {
        supertest(app)
            .get("/users/me")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    it("Should return a 401 if not authenticated", (done) => {
        supertest(app)
            .get("/users/me")
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done)
    });
});

describe("POST /users", () => {
    it("Should create a user", (done) => {
        var email = "uniqueemail@example.com"
        var password = "9webipasd"
        supertest(app)
            .post("/users")
            .send({
                email,
                password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }
                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password); // Hashed?
                    done();
                }).catch((e) =>  done(e));
            });
    });

    it("Should return validation errors", (done) => {
        var email = "notvalid";
        var password = "";
        supertest(app)
            .post("/users")
            .send({
                email: email,
                password: password
            })
            .expect(400) // Doesn't send anything back becuase our User model breaks it. Catch block of our "/users" route.
            .end(done);
    });

    it("Should not create duplicate email/user", (done) => {
        supertest(app)
            .post("/users")
            .send({
                email: users[0].email,
                password: "sdohfsdfa"
            })
            .expect(400)
            .end(done);
    });
});

describe("POST /users/login", () => {
    it("should login user and return auth token", (done) => {
        supertest(app)
            .post("/users/login")
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers["x-auth"]).toExist();
            })
            .end((err,res) => {
                if(err){
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: "auth",
                        token: res.headers["x-auth"]
                    });
                    done();
                }).catch((e) =>  done(e));
            });
    });

    it("should reject invalid login", (done) => {
        supertest(app)
            .post("/users/login")
            .send({
                email: users[1].email,
                password: "incorrect!"
            })
            .expect(400)
            .expect((res) => {
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toEqual(0); // No token...
                }).catch((e) => done(e));
            })
            .end(done);
    });
});