const router = require('express').Router();
const auth = require('../middleware/auth.middleware');

module.exports = function() {
    const lectures = require('../controllers/lectures.controller')();
    router.get('/', lectures.getLectures);
    router.post('/add-lectures', lectures.addLectures);
    router.put('/update-lectures/:id', lectures.updateLectures);
    router.delete('/delete-lectures/:id', lectures.deleteLectures);
    router.post('/report', auth(), lectures.getReport);
    return router;
}