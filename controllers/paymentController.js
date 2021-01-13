const expressAsyncHandler = require('express-async-handler');
const axios = require('axios');
const { Payment } = require('../models/paymentModel.js');

//PAYSTACK POST REQUES HANDLER
const paystackPostRequestProxyController = expressAsyncHandler(
  async (req, res) => {
    try {
      let { data } = await axios.post(
        req.body.paystackUrl,
        req.body.paymentDetails,
        {
          headers: {
            Authorization: `Bearer ${process.env.paystackTestSecretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
);

//PAYSTACK GET REQUEST HANDLER
const paystackGetRequestProxyController = expressAsyncHandler(
  async (req, res) => {
    try {
      const { data } = await axios.get(req.body.paystackUrl, {
        headers: {
          Authorization: `Bearer ${process.env.paystackTestSecretKey}`,
          'Content-Type': 'application/json',
        },
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

const fetchAllPaymentsController = expressAsyncHandler(async (req, res) => {
  const payments = await Payment.find({});
  res.status(200).json(payments);
});
module.exports = {
  paystackPostRequestProxyController,
  paystackGetRequestProxyController,
  fetchAllPaymentsController,
};
