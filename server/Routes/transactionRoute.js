const express = require('express');
const router = express.Router();
const { registerUser } = require('../Controller/user');
const { depositFunds, transferFunds, getTransactionHistory } = require('../Controller/transaction');
const { requestFunds, acceptFunds, requestList, rejectRequest, getRequestHistory } = require('../Controller/requestAndAcceptFunds')

router.post('/register', registerUser);

// POST /api/transactions/deposit
router.post('/deposit', depositFunds);

// POST /api/transactions/transfer
router.post('/transfer', transferFunds);

// POST /api/transactions/request
router.post('/request', requestFunds);

// POST /api/transactions/accept
router.post('/accept/:id', acceptFunds);

// POST /api/transactions/reject
router.post('/reject/:id', rejectRequest);

// GET /api/transactions/list
router.get('/recipient/:email', requestList);

// GET /api/transactions/history
router.get('/history', getTransactionHistory);

// GET /api/request/history
router.get('/request/hist', getRequestHistory);


module.exports = router;