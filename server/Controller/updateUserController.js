const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../Models/userDB'); 
const router = express.Router();

// Update user profile
router.put('/profile/:id', async (req, res) => {
    try {
        const { currentPassword, name, email, username, password } = req.body;

        // Fetch the user by ID
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

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
        // if (profileImg) updates.profileImg = profileImg;

        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;