const router = require('express').Router();

module.exports = function() {
    const classC = require('../controllers/class.controller')();
    router.get('/', classC.getClass);
    router.post('/add-class', classC.addClass);
    router.put('/update-class/:id', classC.updateClass);
    router.delete('/delete-class/:id', classC.deleteClass);
    return router;
}