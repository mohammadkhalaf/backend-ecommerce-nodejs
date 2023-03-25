const { UnauthorizedError } = require('../errors/index');
const attachCookiesToResponse = ({ res, token }) => {
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};

const checkPermission = (requestUser, resourceUserId) => {
  console.log(requestUser.role);
  console.log(resourceUserId);
  if (requestUser.role === 'admin') return;
  if (requestUser === resourceUserId) return;
  throw new UnauthorizedError('not authorized to access');
};
module.exports = { attachCookiesToResponse, checkPermission };
