const express = require('express');
const { singup, login} = require('../controllers/authController');
const { useValidation } = require('../middleware/validate');
const { singupValidationSchema } = require('../utils/validation/signupValidation');

const router = express.Router();

router.put('/signup', useValidation(singupValidationSchema), singup)

router.post('/login', login)

router.get('/ok', (req, res) => {
    res.send('express...')
})

module.exports = router;