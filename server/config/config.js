// CONFIGURE DATABASES
var env = process.env.NODE_ENV || 'development'; // Only set on Heroku. Configure on package.json file for test/development environments. Allows us to use different databases.

console.log("env ******", env);

if(env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";
}