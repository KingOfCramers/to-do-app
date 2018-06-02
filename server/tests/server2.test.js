const supertest = require("supertest");
const expect = require("expect");

const app = require("../server2").app;

/*

it("Should return 'Hello World' response", (done) => {
    supertest(app)
        .get("/")
        .expect(404)
        .expect((res) => {
            expect(res.body).toInclude({
                error: "Page not found."
            })
        }) // By just passing a string, it defaults to checking the res.body
        .end(done);
});
*/

describe("GET /users", () => {
    it("Should return the current user", (done) => {
        supertest(app)
            .get("/users")
            .expect(200)
            .expect((res) => {
                expect(res.body).toInclude({
                    name: "Harrison",
                    age: 24
                })
            })
            .end(done);
    });
});