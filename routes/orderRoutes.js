const express = require('express');
const {
  addOrderItemsController,
  getOrderByIdController,
  getMyOrdersController,
  getAllOrdersController,
  updateOrderToDeliveredController,
} = require('../controllers/orderController.js');
const { protect } = require('../middlewares/authMiddleware.js');

const orderRoutes = express.Router();

//products
orderRoutes.get('/myorders', protect, getMyOrdersController);
orderRoutes.get('/:id', protect, getOrderByIdController);
orderRoutes.route('/').post(protect, addOrderItemsController);
orderRoutes.get('/', protect, getAllOrdersController);
orderRoutes.put(
  '/update-order-to-delivered/:id',
  updateOrderToDeliveredController
);

module.exports = { orderRoutes };
