const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const dbConnect require( './config/db';
const app = express();
app.use(cors());

// const productRoutes require( './routes/productRoutes';
const { notFound, errorHandler } = require('./middlewares/errorMiddleware.js');
const userRoutes = require('./routes/userRoutes.js');
const { orderRoutes } = require('./routes/orderRoutes.js');
const { paymentRoutes } = require('./routes/paymentRoutes.js');
const { paystackWebhookRoute } = require('./routes/paymentWebHookRoute.js');
const { connectDb } = require('./config/connectDb.js');
const productRoutes = require('./routes/productRoutes.js');

dotenv.config();
connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/pay', paymentRoutes);
app.use('/paystack/webhook', paystackWebhookRoute);

app.get('/', (req, res) => res.json({ app: 'MERN ECOMMERCE' }));
//Error Handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server is runing in ${process.env.NODE_ENV} on port ${PORT}`)
);
