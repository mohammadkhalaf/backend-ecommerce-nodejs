const Review = require('../models/review');
const Product = require('../models/product');
const { checkPermission } = require('../utils/utils');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new BadRequestError('Product in not found with id' + productId);
  }
  const alreadySubmittedReview = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadySubmittedReview) {
    throw new BadRequestError('Already submitted review to this product');
  }
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({});
  res.status(StatusCodes.OK).json({ reviews, counts: reviews.length });
};
const getSingleReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById({ _id: id });
  if (!review) {
    throw new NotFoundError('review is not found');
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  res.send('update');
};
const deleteReview = async (req, res) => {
  res.send('remove');
};

module.exports = {
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  createReview,
};
