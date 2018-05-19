const express = require("express");

const app = express();

app.get("/", (req,res) => {
    res.status(404).send({
        error: 'Page not found.',
        name: "Todo App"
    });
});

app.get("/users", (req,res) => {
    res.status(200).send([{name: "Harrison", age: 24},{name:"Peter", age: 26}])
})

app.listen(3001)

module.exports.app = app;