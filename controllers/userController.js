const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors/index');
const User = require('../models/user');
const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: 'user' }).select('-password');
  res.status(StatusCodes.OK).json({ users });
};
const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById({ _id: id }).select('-password');
  if (!user) {
    throw new BadRequestError('user is not found');
  }
  res.status(StatusCodes.OK).send(user);
};

const showCurrentUser = async (req, res) => {
  res.send('current');
};
const updateUser = async (req, res) => {
  res.send('update users');
};

const updateUserPassword = async (req, res) => {
  res.send(' updateUserPassword');
};
module.exports = {
  updateUser,
  updateUserPassword,
  getAllUsers,
  getSingleUser,
  showCurrentUser,
};
