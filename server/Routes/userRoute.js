const express = require('express');
const router = express.Router();
const { registerUser, upload } = require('../Controller/user');
const { loginUser } = require('../Controller/loginController')
const { protect } = require('../Middleware/authMiddleware');

// POST /api/transactions/deposit
router.post('/register', upload.single('photo'), registerUser);

// POST 
router.post('/login', loginUser);

module.exports = router; 