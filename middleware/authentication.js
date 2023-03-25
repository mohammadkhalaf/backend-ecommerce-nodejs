const { UnauthenticatedError, UnauthorizedError } = require('../errors/index');
const jwt = require('jsonwebtoken');
const authUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new UnauthenticatedError('auth is invalid');
  }

  try {
    const { userId, name, role } = jwt.verify(token, process.env.SECRET);
    req.user = { name, userId, role };

    next();
  } catch (error) {
    throw new UnauthenticatedError('auth is invalid');
  }
};
const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unauthorized to access this route');
    }
    next();
  };
};
module.exports = { authUser, authorizePermission };
