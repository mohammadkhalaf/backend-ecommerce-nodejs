const Order = require('../models/order');
const Product = require('../models/product');
const { StatusCodes } = require('http-status-codes');
const { checkPermission } = require('../utils/utils');
const { BadRequestError, NotFoundError } = require('../errors');
const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'random_value';
  return { client_secret, amount };
};
const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findOne({ _id: id });
  if (!order) {
    throw new NotFoundError('Order not found');
  }

  checkPermission(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};
const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError(' No cart items provided');
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
  }
  const total = tax + shippingFee + subTotal;
  const payment = await fakeStripeAPI({ amount: total, currency: 'usd' });
  const order = await Order.create({
    orderItems,
    tax,
    shippingFee,
    subTotal,
    total,
    clientSecret: payment.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.OK)
    .json({ order, clientSecret: payment.client_secret });
};
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { paymentIntentId } = req.body;
  let order = await Order.findOne({ _id: id });
  if (!order) {
    throw new NotFoundError('no order found');
  }
  order = await Order.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.findOne({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ orders });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
  getCurrentUserOrders,
};
