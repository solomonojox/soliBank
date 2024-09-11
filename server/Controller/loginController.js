const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/userDB');

exports.loginUser = async (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    let user;
    try {
        // Try to find user by email
        user = await User.findOne({ email: identifier });
        if (!user) {
            // If not found, try to find user by username
            user = await User.findOne({ username: identifier });
            if (!user) {
                return res.status(400).send({ message: 'Invalid identifier, please check again' });
            }
        }
    } catch (error) {
        return res.status(500).send({ message: 'Server error' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send({ message: 'Invalid password, please check again' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const userDto = {
        token,
        name: user.name,
        email: user.email,
        username: user.username,
        accountNumber: user.accountNumber,
        balance: user.balance,
        photo: user.profileImg,
        _id: user._id
    };

    res.status(201).send({ userDto, message: 'Login successful' });
};