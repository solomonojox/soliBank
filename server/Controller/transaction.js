const User = require('../Models/userDB');
const Transaction = require('../Models/transactionDB');

// @desc    Deposit funds to a user's account
const depositFunds = async (req, res) => {
    const { accountNumber, amount, description } = req.body;

    try {
        // Validate amount
        if (amount < 100) {
            return res.status(400).json({ msg: 'Amount must not be less than ₦100' });
        }

        
        if (description === ''){
            return res.status(400).json({msg: "You must add a description"})
        }
        if (amount > 1000000){
            return res.status(400).json({ msg: 'Deposit limit is ₦1,000,000. Please try again with a lesser amount.'})
        }
        
        // Find the user by account number
        const user = await User.findOne({ accountNumber });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        if ((amount + user.balance) > 10000000 ){
            return res.status(400).json({ msg: 'Your account balance can not be more than ₦10,000,000' })
        }
        // Update the user's balance
        user.balance += amount;
        await user.save();

        // Record the transaction
        const transaction = new Transaction({
            type: 'deposit',
            amount,
            toAccount: accountNumber,
            description
        });
        await transaction.save();

        res.status(200).json({ msg: 'Deposit successful', balance: user.balance });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @desc    Transfer funds between users
const transferFunds = async (req, res) => {
    const { fromAccount, toAccount, amount, description } = req.body;

    try {
        // Validate amount
        if (amount <= 0) {
            return res.status(400).json({ msg: 'Amount must be greater than zero' });
        }

        // Find both users by account numbers
        const sender = await User.findOne({ accountNumber: fromAccount });
        const recipient = await User.findOne({ accountNumber: toAccount });

        if (!sender) {
            return res.status(404).send({ msg: 'Sender not found' });
        }

        if (!recipient) {
            return res.status(404).send({ msg: 'Recipient not found' });
        }

        // Check if sender has enough balance
        if (sender.balance < amount) {
            return res.status(400).json({ msg: 'Insufficient funds' });
        }

        // Check if amount is less than 100
        if (amount < 100) {
            return res.status(400).json({ msg: 'Amount must be greater than 100' });
        }
        if (description === ''){
            return res.status(400).json({msg: "You must add a description"})
        }

        // Update balances
        sender.balance -= amount;
        recipient.balance += amount;

        await sender.save();
        await recipient.save();

        // Record the transaction
        const transaction = new Transaction({
            type: 'transfer',
            amount,
            fromAccount,
            toAccount,
            description
        });
        await transaction.save();

        res.status(200).json({ msg: 'Transfer successful', senderBalance: sender.balance.toLocaleString(), recipient });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// @desc    Get transaction history by userId
// @route   GET /api/transactions/history
const getTransactionHistory = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ msg: 'User ID is required' });
        }

        // Fetch user by userId to get accountNumber
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const accountNumber = user.accountNumber;

        // Fetch transactions where the user is either sender or recipient
        const transactions = await Transaction.find({
            $or: [
                { fromAccount: accountNumber },
                { toAccount: accountNumber }
            ]
        }).sort({ date: -1 });

        res.status(200).json(transactions);
    } catch (err) {
        console.error('Error fetching transaction history:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = { depositFunds, transferFunds, getTransactionHistory }; 