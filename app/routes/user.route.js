const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
module.exports = function() {
    const user = require('../controllers/user.controller')();
    router.get('/all', user.getAll);
    router.delete('/delete-user/:id', user.deleteUser);
	//router.get('/:id', user.getUser);
	router.get('/me', auth(), user.getUserByToken);
    router.post('/login', user.login);
    router.post('/register', user.createUser);
    router.put('/update-user/:id', auth(), user.updateUser);
    return router;
}