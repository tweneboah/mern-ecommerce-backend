const expressAsyncHandler = require('express-async-handler');
const fs = require('fs');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel.js');
const { cloudinaryUploadImage } = require('../utils/cloudinary.js');

//Get all Products
const getProducts = asyncHandler(async (req, res) => {
  console.log(req.query.name);
  const products = await Product.find({
    name: {
      $regex: new RegExp(req.query.name && req.query.name.toLocaleLowerCase()),
    }, //Partial Search
  }).sort('-createdAt');
  if (products || products.length === []) {
    res.json(products);
  } else {
    throw new Error('Error occured');
  }
});

const getProductsByCategoryController = asyncHandler(async (req, res) => {
  console.log(req.query.name);
  const products = await Product.find({ category: req.body.category }).sort(
    '-createdAt'
  );
  if (products || products.length === []) {
    res.json(products);
  } else {
    throw new Error('Error occured');
  }
});

//Get all Products
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404); //You can ignore this and it will set to 500 bease on our configuration inside our error handler middleware
    //Since we have our custom middleware we can pass our own error to the error handler because we are making use of express-async-handler
    throw new Error('Product Not found');
  }
});

const fileUploadController = async (req, res) => {
  try {
    const fileStr = req.body.data;
    const upload = await cloudinary.uploader.upload(fileStr, {
      upload_preset: 'yvxvtoyq',
    });
    res.send(upload);
    console.log(upload);
  } catch (error) {
    console.log(error);
  }
};

const createProductController = asyncHandler(async (req, res) => {
  const uploader = async fileToUpload =>
    await cloudinaryUploadImage(fileToUpload, 'name-of-my-folder');
  const urls = [];
  const files = req.files;

  for (const file of files) {
    const { path } = file;

    console.log('raw file', path);

    // //Transform it using sharp
    // sharp(path).resize(200, 200);

    const newPath = await uploader(path, {
      width: 350,
      fetch_format: 'auto',
      crop: 'scale',
    });
    urls.push(newPath);
    fs.unlinkSync(path);
  }
  // const allImages = [];

  const product = await Product.insertMany({
    image: urls,
    name: req.body.name.toLowerCase(),
    price: req.body.price,
    user: req.user._id,
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
    numReviews: req.body.numReviews,
    description: req.body.description,
    isProductNew: Date.now() + 300000, //a day
  });

  res.status(201).json(product);
});

//==================
//========UPDATE PRODUCT
//=================
const updateProductController = expressAsyncHandler(async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  res.send(updatedProduct);
});

//=============================
// DELETE PRODUCT
//=====================
const deleteProductController = expressAsyncHandler(async (req, res) => {
  const deletedProduct = await Product.findByIdAndRemove(req.params.id);
  res.send(deletedProduct);
});

//===========
// FIND PRODUCT BY NAME
//==========

const findProductByNameController = expressAsyncHandler(async (req, res) => {
  const products = await Product.find({ name: req.query });
  if (products || products.length === []) {
    res.json(products);
  } else {
    throw new Error('Error occured');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProductController,
  updateProductController,
  deleteProductController,
  findProductByNameController,
  fileUploadController,
  getProductsByCategoryController,
};
