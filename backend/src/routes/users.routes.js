const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controllers')

router.post('/register',usersController.register);
router.get('/:userid',usersController.getUserById);
// router.post('/login',usersController.login);

module.exports = router;