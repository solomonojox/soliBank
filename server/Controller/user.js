const bcrypt = require('bcryptjs');
const User = require('../Models/userDB');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('../Config/cloudinaryConfig');
const path = require('path');

// Set up multer for handling file uploads
const storage = multer.memoryStorage();  // Store the image in memory
const upload = multer({ storage: storage });

// Helper function to generate a unique 10-digit account number
const generateAccountNumber = async () => {
    let accountNumber;
    let isUnique = false;

    while (!isUnique) {
        accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const existingUser = await User.findOne({ accountNumber });
        if (!existingUser) {
            isUnique = true;
        }
    }

    return accountNumber;
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, username, email, password, profileImg } = req.body;
    const photo = req.file; // The uploaded file
    // console.log('Photo URL in backend:', profileImg);

    // Validate input fields
    if (!name || !username || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Generate a unique account number
        const accountNumber = await generateAccountNumber();

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload the image to Cloudinary
        let photoUrl = '';
        if (photo) {
            const result = await cloudinary.uploader.upload(photo.buffer, {
                folder: 'user_photos',
                use_filename: true,
                unique_filename: true,
            });
            photoUrl = result.secure_url; // Get the image URL from Cloudinary
        }

        // Create a new user
        user = new User({
            name,
            username,
            email,
            password: hashedPassword,
            accountNumber,
            profileImg: profileImg,  // Save the Cloudinary image URL
        });

        // console.log('Check 3', req.body.profileImg)

        // Save the user to the database
        await user.save();

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(201).json({ 
            token,
            name: user.name,
            email: user.email,
            accountNumber: user.accountNumber,
            balance: user.balance,
            photo: user.profileImg,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = { registerUser, upload };