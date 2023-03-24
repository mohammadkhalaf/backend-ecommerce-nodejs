const { UnauthenticatedError } = require('../errors/index');
const jwt = require('jsonwebtoken');
const authUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new UnauthenticatedError('auth is invalid');
  }

  try {
    const { userId, name } = jwt.verify(token, process.env.SECRET);
    req.user = { name, userId };

    next();
  } catch (error) {
    throw new UnauthenticatedError('auth is invalid');
  }
};
module.exports = { authUser };
