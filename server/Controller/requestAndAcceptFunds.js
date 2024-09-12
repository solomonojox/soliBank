// const express = require('express');
// const router = express.Router();
const Request = require('../Models/requestDB');
const Transaction = require('../Models/transactionDB')
const User = require('../Models/userDB');

// @route   POST /api/requests
// @desc    Create a money request
// @access  Public
const requestFunds = async (req, res) => {
  const { requesterEmail, recipientEmail, amount, description } = req.body;

  try {
    const requester = await User.findOne({ email: requesterEmail });
    const recipient = await User.findOne({ email: recipientEmail });

    if (!requester || !recipient) {
        return res.status(404).json({ msg: 'User not found, please confirm the email address' });
    }
    if (requesterEmail === recipientEmail){
        return res.status(404).json({msg: 'You can not place request to yourself'})
    }

    if (!description) {
        return res.status(400).json({ msg: 'You must add a description' });
    }

    const newRequest = new Request({
        requester: requester._id,
        recipient: recipient._id,
        amount,
        description
    });
    console.log(newRequest)

    await newRequest.save();
    res.status(201).json({ msg: 'Request created successfully', request: newRequest });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
};

const acceptFunds = async (req, res) => {
  try {
    // Find the request
    const request = await Request.findById(req.params.id).populate('requester').populate('recipient');

    if (!request) {
    return res.status(404).json({ msg: 'Request not found' });
    }

    if(request.status === 'accepted'){
        return res.status(400).json({ msg: 'Request has already been accepted' });
    }
    if (request.status === 'rejected'){
        return res.status(400).json({ msg: 'Request was already rejected' });
    }

    const { requester, recipient, amount } = request;

    if (recipient.balance < amount) {
        return res.status(400).json({ msg: 'Insufficient funds' });
    }

    // Debit the recipient
    recipient.balance -= amount;
    await recipient.save();

    // Credit the requester
    requester.balance += amount;
    await requester.save();

    // Create a new transaction
    const transaction = new Transaction({
        type: 'request',
        fromAccount: recipient.accountNumber,
        toAccount: requester.accountNumber,
        amount,
        description: `Funds from ${recipient.name} to ${requester.name}`,
    });
    await transaction.save();

    // Update request status
    request.status = 'accepted';
    await request.save();

    res.status(200).json({ msg: 'Request accepted successfully', request, transaction });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error', err: err });
  }
};

const rejectRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ msg: 'Request not found' });
        }
        if(request.status === 'accepted'){
            return res.status(400).json({ msg: 'Request has already been accepted' });
        }
        request.status = 'rejected';
        await request.save();
        res.status(200).json({ msg: 'Request rejected successfully', request });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
}

const requestList = async (req, res) => {
    try {
        const recipient = await User.findOne({ email: req.params.email });
        if (!recipient) {
            return res.status(404).json({ msg: 'Recipient not found' });
        }

        const requests = await Request.find({ recipient: recipient._id })
            .populate('requester')
            .sort({ createdAt: -1 });
        res.status(200).json({ requests });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
}

const getRequestHistory = async (req, res) => {
    try {
        try {
            const requests = await Request.find().populate('requester').populate('recipient');
            res.status(200).json({ requests });
          } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: 'Server error' });
          }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
}

module.exports = { requestFunds, acceptFunds, rejectRequest, requestList, getRequestHistory };
