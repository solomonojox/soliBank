const { updatePhoto, upload} = require('../Controller/updatePhotoController');
const express = require('express')
const router = express.Router()

router.put('/profile/:id', upload.single('photo'), updatePhoto);

module.exports = router