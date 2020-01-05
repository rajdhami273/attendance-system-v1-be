const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
module.exports = function() {
    const students = require('../controllers/students.controller')();
    router.get('/', students.getStudents);
	router.get('/get-students-of-class/:classId', auth(), students.getStudentsOfClass);
    router.post('/add-Students', students.addStudents);
    router.put('/update-Students/:id', students.updateStudents);
    router.delete('/delete-Students/:id', students.deleteStudents);
    router.get('/add-students-from-excel/:class/:classId', students.addStudentsFromExcel);
    return router;
}