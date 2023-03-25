const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors/index');
const User = require('../models/user');
const { checkPermission } = require('../utils/utils');
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
  checkPermission(req.user, id);
  res.status(StatusCodes.OK).send(user);
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
const updateUser = async (req, res) => {
  console.log(req);
  const { name, email } = req.body;
  if (!name || !email) {
    throw new BadRequestError('Please provide both values');
  }
  const user = await User.findByIdAndUpdate(
    { _id: req.user.userId },
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(StatusCodes.OK).json({ user });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequestError('Please provide both values');
  }
  const user = await User.findById({ _id: req.user.userId });
  const isPassword = await user.compare(oldPassword);
  if (!isPassword) {
    throw new UnauthenticatedError('invalid credentials');
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'password has been updated' });
};
module.exports = {
  updateUser,
  updateUserPassword,
  getAllUsers,
  getSingleUser,
  showCurrentUser,
};
