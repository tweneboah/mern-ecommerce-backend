const express = require('express');
const {
  fetchAllPaymentsController,
  paystackPostRequestProxyController,
} = require('../controllers/paymentController.js');

const paymentRoutes = express.Router();

paymentRoutes.post('/', paystackPostRequestProxyController);
paymentRoutes.get('/', fetchAllPaymentsController);

module.exports = { paymentRoutes };
