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
  const reviews = await Review.find({})
    .populate({
      path: 'product',
      select: 'name company price',
    })
    .populate({ path: 'user', select: 'name' });
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
  const { id } = req.params;
  let review = await Review.findById({ _id: id });
  if (!review) {
    throw new NotFoundError('review is not found');
  }
  checkPermission(req.user, review.user);
  review = await Review.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({ review });
};
const deleteReview = async (req, res) => {
  const { id } = req.params;
  let review = await Review.findById({ _id: id });
  if (!review) {
    throw new NotFoundError('review is not found');
  }
  checkPermission(req.user, review.user);
  review = await Review.findByIdAndDelete({ _id: id });
  res.status(StatusCodes.OK).json({ msg: 'deleted' });
};

const getSingleProductReviews = async (req, res) => {
  const { id } = req.params;
  const reviews = await Review.find({ product: id });

  res.status(StatusCodes.OK).json({ reviews });
};

module.exports = {
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  createReview,
  getSingleProductReviews,
};
