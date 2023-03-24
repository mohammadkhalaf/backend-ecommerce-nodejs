const express = require('express');
const router = express.Router();
const {
  updateUser,
  updateUserPassword,
  getAllUsers,
  getSingleUser,
  showCurrentUser,
} = require('../controllers/userController');
const { authUser } = require('../middleware/authentication');

router.route('/').get(authUser, getAllUsers);
router.route('/showMe').get(showCurrentUser);
router.route('/updatepassword').patch(updateUserPassword);
router.route('/updateuser').patch(updateUser);
router.route('/:id').get(authUser, getSingleUser);

module.exports = router;
