const Order = require('../models/order');
const Product = require('../models/product');
const { StatusCodes } = require('http-status-codes');
const { checkPermission } = require('../utils/utils');
const { BadRequestError, NotFoundError } = require('../errors');
const getAllOrders = (req, res) => {
  res.send('all orders');
};

const getSingleOrder = (req, res) => {
  res.send('one orders');
};
const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError('cart items provided');
  }
  if (!tax || !shippingFee) {
    throw new BadRequestError('Please provide tax and shipping fee ');
  }
  let orderItems = [];
  let subTotal = 0;
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new NotFoundError('no product found');
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      name,
      price,
      image,
      product: _id,
      amount: item.amount,
    };
    orderItems = [...orderItems, singleOrderItem];
    subTotal += item.amount * price;
    console.log(orderItems);
    console.log(subTotal);
  }

  res.send('create orders');
};
const updateOrder = (req, res) => {
  res.send('update');
};

const getCurrentOrder = (req, res) => {
  res.send('get current');
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
  getCurrentOrder,
};
