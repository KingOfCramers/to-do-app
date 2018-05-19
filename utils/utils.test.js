const expect = require("expect");
const utils = require("./utils");

describe("Test Basic examples", () => {

    // "It" is from mocha.
    it("Should add two numbers", () => {
        var res = utils.add(1,4);

        // Expect uses "toBe"
        expect(res).toBe(5).toBeA('number');

        // Same as...
        /*if(res !== 5){
             throw Error
        }*/
    });


    // A MORE COMPLICATED EXAMPLE

    it("Should check first/last name", () => {
        var user = {location: "Washington", age: 24};
        const res = utils.setName("Harrison Cramer", user);
        expect(res).toBeA('object').toInclude({
            firstName: "Harrison",
            lastName: "Cramer"
        });
    });


    //// EXAMPLES /////

    it("Should square a number", () => {
        var res = utils.square(6);

        expect(res).toBe(36).toBeA('number');
    });

    it("Should make sure two nums/strings aren't the same", () => {
        expect(12).toNotBe(14);
        expect("Harry").toNotBe("Peter");
    });

    it("Should ensure two objects are identical", () => {
        expect({name: "Harrison"}).toEqual({name: "Harrison"});
    });

    it("Should/n't contain a value [Array]", () => {
        expect([2,3,4]).toInclude(4);
        expect([2,3,4]).toExclude(1);
    });

    it("Should/n't contain a value [object]", () => {
        expect({
            name: "Harrison",
            age: 25,
            location: "Washington D.C."
        }).toInclude({ // could use .toExclude
            age: 25
        });
    });

    // TESTING ASYNCHRONOUS CODE //
    // By providing an argument to the mocha callback, it tells it that our function is asynchronous. In other words, our expect check won't finish run UNTIL "done" is called.

    //// THE WRONG WAY
    it("Should add two numbers", () => { // This is the callback that fires when Mocha thinks the test is done. THis will run immediately unless you provide the "done argument."
        utils.asyncAdd(4,5,(sum) => { // Without the "done" argument, the delayed callback will not run...
            expect(sum).toBe(9).toBeA('number');
        });
    });


    //// THE RIGHT WAY
    it("Should add two numbers", (done) => { // Callback
        utils.asyncAdd(4,5,(sum) => {
            expect(sum).toBe(9).toBeA('number');
            done(); // Mocha only finishes processing the callback AFTER the done function is called, which occurs after our asynchronous code.
        });
    });

    // Another example...
    it("Should square a number", (done) => {
        utils.asyncSquare(8,(sum) => {
            expect(sum).toBeA('number').toBe(64);
            done();
        })
    })

});


//// DESCRIBE LETS US GROUP LOTS OF TESTS TOGETHER ///

describe("Test two Examples", () => {
    it("Should make sur  two nums/strings aren't the same", () => {
        expect(12).toNotBe(14);
        expect("Harry").toNotBe("Peter");
    });

    it("Should ensure two objects are identical", () => {
        expect({name: "Harrison"}).toEqual({name: "Harrison"});
    });
})








