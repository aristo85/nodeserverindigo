const express = require('express');
const { privateData } = require('../controllers/privateController');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/myData', isAuth, privateData)

module.exports = router;