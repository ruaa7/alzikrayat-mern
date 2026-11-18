
const express = require('express');
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');

const router = express.Router();

router.post('/api/auth/register', validateRegister, authController.register);
router.post('/api/auth/login', validateLogin, authController.login);

module.exports = router;
