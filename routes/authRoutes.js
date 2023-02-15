const express = require('express');
const { singup, login, createResetCode, passwordReset } = require('../controllers/authController');
const { useValidation } = require('../middleware/validate');
const { resetPassValidationSchema } = require('../utils/validation/resetPassValidation');
const { singupValidationSchema } = require('../utils/validation/signupValidation');


const router = express.Router();

router.put('/signup', useValidation(singupValidationSchema), singup)

router.post('/login', login)

router.post('/forgotpass/createcode', createResetCode)

router.put('/forgotpass/resetpass', useValidation(resetPassValidationSchema), passwordReset)

router.get('/ok', (req, res) => {
    res.send("hi")
})

module.exports = router;
