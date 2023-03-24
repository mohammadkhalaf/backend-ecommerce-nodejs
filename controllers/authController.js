const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors/index');
const { attachCookiesToResponse } = require('../utils/utils');
const registerUser = async (req, res) => {
  const { email, name, password } = req.body;
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new BadRequestError('User is already exist');
  }
  const firstAccount = (await User.countDocuments({})) === 0;
  const role = firstAccount ? 'admin' : 'user';
  const user = await User.create({ email, name, password, role });
  const token = user.createToken();
  attachCookiesToResponse({ res, token });

  res.status(StatusCodes.CREATED).json({ user, token });
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide  email and password');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('You are not registered');
  }
  const isPasswordCorrect = await user.compare(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Password is not correct');
  }
  const token = user.createToken();
  attachCookiesToResponse({ res, token });
  res.status(StatusCodes.CREATED).json({ user, token });
};

const logoutUser = async (req, res) => {
  res.cookie('token', 'blablabla ', {
    httpOnly: true,
    expires: new Date(Date.now() + 5000),
  });
  res.status(200).json({ msg: 'logged out' });
};
module.exports = { registerUser, loginUser, logoutUser };
