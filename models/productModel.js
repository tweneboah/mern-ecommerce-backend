const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    image: [
      {
        url: { type: String, required: [true, 'url is requrired'] },
        public_id: { type: String, required: [true, 'image id is requred'] },
      },
    ],
    isProductNew: {
      type: Date,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'Fashion',
        'Gents',
        'Ladies',
        'Hot Deals',
        'Phone Accessories',
        'Laptops and Accessories',
        'Home Appliances',
        'Auto Parts',
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    reviews: [reviewSchema],
  },

  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
