const User = require('../Models/userDB');

exports.getUser = (req, res) => {
  User.find()
    .then(User => {
      res.status(200).json({
        message: "Users fetched successfully",
        User: User
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    })
};

exports.getUserProfileByEmail = async (req, res) => {
    try {
        const email = req.query.email;
        const user = await User.findOne({ email }); // Find user by email

        if(!user){
            return res.status(404).json({ msg: 'User not found' });
        }
        const userDto = {
            _id: user._id,
            name: user.name,
            email: user.email,
            accountNumber: user.accountNumber,
            balance: user.balance.toLocaleString(),
            profileImg: user.profileImg
        }

        res.json({ msg: 'User fetched successfully', userDto});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getUserProfileByAccountNumber = async (req, res) => {
    try {
        const accountNumber = req.query.accountNumber;
        if (accountNumber.length !== 10) {
            return res.status(400).json({ msg: 'Invalid account number length' });
        }
        const user = await User.findOne({ accountNumber }); // Find user by account
        if (user) {
            res.json(user.name);
        } else {
            res.status(404).json({ msg: 'User not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};