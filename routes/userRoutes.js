const express = require('express');
const {
  authUser,
  getUserProfile,
  getUsersController,
  resetPasswordRequestTokenController,
  newPasswordResetController,
  registerUser,
  updateUserProfileController,
} = require('../controllers/userController.js');
const { isAdmin } = require('../middlewares/adminMiddleware.js');
const { protect } = require('../middlewares/authMiddleware.js');

const userRoutes = express.Router();

//products
userRoutes.post('/login', authUser);
userRoutes.route('/profile').get(protect, getUserProfile);
userRoutes.put('/profile/:id', protect, updateUserProfileController);
userRoutes.post('/register', registerUser);
userRoutes.get('/', protect, isAdmin, getUsersController);
userRoutes.post(
  '/reset-password-request-token',
  resetPasswordRequestTokenController
);
userRoutes.post('/new-password-reset', newPasswordResetController);

module.exports = userRoutes;
