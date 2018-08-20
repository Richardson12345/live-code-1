var express = require('express');
var router = express.Router();
var Controller = require('../controller/itemController')

/* GET users listing. */
router.post('/', Controller.createItem);
router.get('/', Controller.getItem);

module.exports = router;
