const { StatusCodes } = require('http-status-codes');
const Product = require('../models/product');
const {
  UnauthenticatedError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require('../errors/index');
const Review = require('../models/review');
const path = require('path');
const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products });
};
const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById({ _id: id }).populate('review');
  if (!product) {
    throw new NotFoundError('product is not found');
  }

  res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  let product = await Product.findOne({ _id: id });
  if (!product) {
    throw new NotFoundError('product is not found');
  }
  product = await Product.findOneAndDelete({ _id: id });

  const review = await Review.find({ product: id });
  if (review) {
    await Review.deleteMany({ product: id });
  }

  res.status(StatusCodes.OK).json({ msg: 'Product has been deleted' });
};
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new NotFoundError('product is not found');
  }

  res.status(StatusCodes.OK).json({ product });
};
const uploadImage = async (req, res) => {
  console.log(req.files);
  if (!req.files) {
    throw new BadRequestError('no files uploaded!');
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith('image')) {
    throw new BadRequestError('Please uploaded image');
  }
  const maxSize = 1024 * 1024;
  if (!productImage.size > maxSize) {
    throw new BadRequestError('Please uploaded image smaller than 1MB');
  }
  const imagePath = path.join(
    __dirname,
    '../public/uploads' + `${productImage.name}`,
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};
module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
};
