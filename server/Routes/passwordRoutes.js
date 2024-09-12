// passwordRoutes.js
const express = require('express');
const router = express.Router();
const { requestPasswordReset, resetPassword } = require('../controllers/passwordController');

router.post('/forgot-password', requestPasswordReset); // Endpoint to request password reset
router.post('/reset-password', resetPassword);        // Endpoint to reset password

module.exports = router;