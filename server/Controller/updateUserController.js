const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../Models/userDB'); 
const router = express.Router();

// Update user profile
router.put('/profile/:id', async (req, res) => {
    try {
        const { name, email, username, password, profileImg } = req.body;
        const updates = {};

        // Check if the user is trying to update their password and hash it
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.password = hashedPassword;
        }

        // Add other updates
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (username) updates.username = username;
        if (profileImg) updates.profileImg = profileImg;

        // Update the user in the database
        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;