const router = require('express').Router();

module.exports = function() {
    const subjects = require('../controllers/subjects.controller')();
    router.get('/', subjects.getSubjects);
	router.get('/get-subjects-of-class/:classId', subjects.getSubjectsOfClass);
    router.post('/add-subjects', subjects.addSubjects);
    router.put('/update-subjects/:id', subjects.updateSubjects);
    router.delete('/delete-subjects/:id', subjects.deleteSubjects);
    return router;
}