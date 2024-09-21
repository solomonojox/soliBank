const User = require('../Models/userDB');
const multer = require('multer');
const cloudinary = require('../Config/cloudinaryConfig');
const express = require('express');
const router = express.Router();
// const path = require('path');

// Set up multer for handling file uploads
const storage = multer.memoryStorage();  // Store the image in memory
const upload = multer({ storage: storage });

router.put('/profile/:id', async (req, res) => {
  const { profileImg } = req.body
  const photo = req.file;

  const updates = {};
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

  if (profileImg) updates.profileImg = profileImg;

  // Update the user in the database
  const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.send(updatedUser);
})

module.exports = router;