module.exports.add = (a,b) => a + b;
module.exports.square = (a) => a * a;
module.exports.setName = (name,user) => {
    let names = name.split(" "); // Returns an array.
    user.firstName = names[0];
    user.lastName = names[1]; // Assigns values
    return user; // Returns modified user object.
}

// Asynchronous code (dummy example)
module.exports.asyncAdd = (a,b,callback) => {
    setTimeout(() => {
        callback(a + b);
    }, 1000);
};

module.exports.asyncSquare = (a,callback) => {
    setTimeout(() => {
        callback(a * a); // Passes a single number into the callback, which is sum...
    }, 1000);
};

