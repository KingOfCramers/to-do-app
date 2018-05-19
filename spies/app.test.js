// Spies allow us to substitute in spies for other functions.
const expect = require("expect");
const rewire = require("rewire");

// const db = require("db"); // We're replacing our db function here with a spy.

const app = rewire("./app"); //  Adds two methods –> app.__get__ and app.__set__

describe("App", () => {

    const db = {
        saveUser: expect.createSpy()
    };

    app.__set__("db", db);

    it("Should call the spy correctly", () => {
       var spy = expect.createSpy(); // This will return a spy function.
       spy("Andrew",25); // Call the spy function.
       expect(spy).toHaveBeenCalledWith("Andrew", 25); // This will cause the test to pass if the spy was called.
    });

    it("Should call saveuser with user object", () => {
        let email = "harrisoncramer@gmail.com";
        let password = "thepassword";

        app.handleSignup(email,password);
        expect(db.saveUser).toHaveBeenCalledWith({email,password    }) // This is a spy
    });
});