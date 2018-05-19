const utils = require("./utils");

it("should add two numbers", () => {
    var res = utils.add(1,4);
    if(res !== 5){
        throw Error
    }
});
