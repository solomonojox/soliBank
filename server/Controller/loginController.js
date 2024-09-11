const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/userDB');

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(401).send({ message: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({ message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        

        const userDto = {
            token,
            name: user.name,
            email: user.email,
            accountNumber: user.accountNumber,
            balance: user.balance,
            photo: user.profileImg,
            _id: user._id
        };

        res.status(201).send({userDto, message: 'Login successful' });
    } catch (error) {
        res.status(500).send({ message: 'Server error' });
    }
};