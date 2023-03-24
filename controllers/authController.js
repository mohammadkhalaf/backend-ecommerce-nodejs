const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors/index');
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
  res.send('login');
};

const logoutUser = async (req, res) => {
  res.send('logout ');
};
module.exports = { registerUser, loginUser, logoutUser };
