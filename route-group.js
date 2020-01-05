const router = require('express').Router();

module.exports = function() {
    router.use('/user', require('./app/routes/user.route')());
    router.use('/class', require('./app/routes/class.route')());
    router.use('/students', require('./app/routes/students.route')());
    router.use('/subjects', require('./app/routes/subjects.route')());
    router.use('/lectures', require('./app/routes/lectures.route')());
    return router;
}