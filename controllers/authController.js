const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const registerUser = async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ newUser });
};
const loginUser = async (req, res) => {
  res.send('login');
};

const logoutUser = async (req, res) => {
  res.send('logout ');
};
module.exports = { registerUser, loginUser, logoutUser };
