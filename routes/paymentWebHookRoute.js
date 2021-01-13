const express = require('express');

const {
  paystackWebhookController,
} = require('../controllers/paymentWebHook.js');

const paystackWebhookRoute = express.Router();

//This will be called by paystack automatically
paystackWebhookRoute.post('/', paystackWebhookController);

module.exports = { paystackWebhookRoute };
