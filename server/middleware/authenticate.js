var { User } = require("../models/user");

// Req refers to the
const authenticate = (req, res, next) => { // The actual route will not run until the next callback is called. The point of the route is to ensure that the token from our request is included in our database. If it isn't the rest of the code will not run, and a 401 error will trigger.

 var token = req.header("x-auth");
    User.findByToken(token).then((user) => { // Model method, we define in our user.js file
        if(!user) { // Will return null
            return Promise.reject(); // Will cause catch block to fire.
        }

        req.user = user;
        req.token = token;
        next(); // Actually fires the route

    }).catch((e) => { // Catches rejected promise
        res.status(401).send();
    });
};

module.exports = {
    authenticate
}