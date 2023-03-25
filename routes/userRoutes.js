const express = require('express');
const router = express.Router();
const {
  updateUser,
  updateUserPassword,
  getAllUsers,
  getSingleUser,
  showCurrentUser,
} = require('../controllers/userController');
const {
  authUser,
  authorizePermission,
} = require('../middleware/authentication');

router
  .route('/')
  .get(authUser, authorizePermission('admin', 'owner'), getAllUsers);
router.route('/showMe').get(authUser, showCurrentUser);
router.route('/updatepassword').patch(authUser, updateUserPassword);
router.route('/updateuser').patch(authUser, updateUser);
router.route('/:id').get(authUser, getSingleUser);

module.exports = router;
