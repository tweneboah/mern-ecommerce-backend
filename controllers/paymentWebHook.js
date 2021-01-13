const expressAsyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../models/userModel.js');
const Order = require('../models/orderModel.js');
const { Payment } = require('../models/paymentModel.js');
//Paystack will this automatically
const paystackWebhookController = expressAsyncHandler(async (req, res) => {
  let secret = process.env.paystackTestSecretKey;
  let hash = crypto
    .createHmac('sha512', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash == req.headers['x-paystack-signature']) {
    const webHookData = req.body;
    if (webHookData.event === 'charge.success') {
      const { amount, reference, currency, channel } = webHookData.data;
      const { last4, exp_year, bank } = webHookData.data.authorization;
      const { email } = webHookData.data.customer;
      if (
        webHookData.data.metadata &&
        webHookData.data.metadata.custom_fields
      ) {
        //Order Id
        const orderId = webHookData.data.metadata.custom_fields;
        const paid = await Order.findByIdAndUpdate(
          orderId,
          {
            isPaid: true,
          },
          { runValidators: true, new: true }
        );

        //Create payment

        const newPayment = await Payment.create({
          user: email,
          order: orderId,
          amountPaid: amount,
          paymentReference: reference,
          bank: bank,
          lastFourDigitOfYourAccount: last4,
        });
        console.log(newPayment);
      }
    }
  }
  //Paystack requires us to send 200
  res.sendStatus(200);
});

module.exports = { paystackWebhookController };
