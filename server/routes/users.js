var express = require('express');
var router = express.Router();
var Controller = require('../controller/userController')

/* GET users listing. */
router.post('/register', Controller.createUser);
router.post('/signin', Controller.signIn);
module.exports = router;
