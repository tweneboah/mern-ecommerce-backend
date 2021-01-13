const dotenv = require('dotenv');
dotenv.config();
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const User = require('../models/userModel.js');
const generateToken = require('../utils/generateToken.js');

//=====================
//====CONFIGURE TO SEND EMAIL=======
//====================

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: process.env.SEND_GRID_KEY,
    },
  })
);

//========================
//Get all Products
//=======================
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  const userRxist = await User.findOne({ email });
  if (userRxist) {
    res.status(400);
    throw new Error('User already exist');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    //Generate a token using crypto
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
      }
      const token = buffer.toString('hex');
      //Send email to this user
      //Send mail
      transporter.sendMail({
        to: user.email,
        from: 'twentekghana@gmail.com',
        subject: 'Verify Your Account',
        html: `
        <p>You requested for password reset</p>
        <h5>Click the link to verify your  <a href='https://blispath-frontend.netlify.app/new-password-update/${token}'>account</a></h5>
        `,
      });
      res.status(200).json({
        message: 'Check your email to verify your account within one hour',
      });
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

//LOGIN
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

//USER PROFILE

//Since this route is protected as soon as a user logins it will grab the id from the request body automatically
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('orders').exec();
  if (user) {
    res.json(user);
  } else {
    res.status(401);
    throw new Error('User not found');
  }
});

//GET ALL USERS

const getUsersController = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

//=============
//Update user profile
// NOTE: Since findByIdAndUpdate does not listen to model middleware we can't use that before the middleware  of hashing the password won't run hence we cant login if we use that API
//==================

const updateUserProfileController = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      password: updatedUser.password,
    });
  } else {
    res.status(401);
    throw new Error('User not found');
  }
});

//===================
//resetPasswordController
//===================
const resetPasswordRequestTokenController = asyncHandler(async (req, res) => {
  //Create a token
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString('hex'); //convert buffer to string
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.send('User does not exist');
    } else {
      user.resetPassworkToken = token;
      user.resetPassworkTokenExpire = Date.now() + 36000000; //valid for 1 hour

      await user.save();

      //Send mail
      transporter.sendMail({
        to: user.email,
        from: 'twentekghana@gmail.com',
        subject: 'Password Reset request',
        html: `
        <p>You requested for password reset</p>
        <h5>Click the link to reset your password <a href='https://blispath-frontend.netlify.app/new-password-update/${token}'>password</a></h5>
        `,
      });
      res.json({ message: 'Check your email to reset your password' });
    }
  });
});

//=================
//New Password
//=================
const newPasswordResetController = asyncHandler(async (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;

  const user = await User.findOne({
    resetPassworkToken: sentToken,
    resetPassworkTokenExpire: { $gt: Date.now() }, //The saved token must be greater than now
  });
  if (!user) {
    throw new Error('Token expired');
  } else {
    user.password = newPassword;
    user.resetPassworkToken = undefined;
    user.resetPassworkTokenExpire = undefined;
    await user.save();
    res.json({ message: 'Password reset success' });
  }
});

module.exports = {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfileController,
  getUsersController,
  resetPasswordRequestTokenController,
  newPasswordResetController,
};
