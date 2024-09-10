const express = require('express');
// const { getUserProfile } = require('../Controller/profile');
const getUser = require('../Controller/profile');
const router = express.Router();
// const jwt = require('jsonwebtoken');

// Middleware to verify JWT
// const authenticateToken = (req, res, next) => {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     if (!token) return res.status(401).send('Access Denied');

//     try {
//         const verified = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = verified;
//         next();
//     } catch (err) {
//         res.status(400).send('Invalid Token');
//     }
// };

// Route to get user profile
// router.get('/profile', authenticateToken, getUserProfile);
router.get('/profile', getUser.getUser);
router.get('/info', getUser.getUserProfileByEmail);
router.get('/infos', getUser.getUserProfileByAccountNumber);

module.exports = router;