const express = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser, forgotPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/register', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
], registerUser);

router.post('/login', loginUser);
router.post('/forgotpassword', forgotPassword);

module.exports = router;
