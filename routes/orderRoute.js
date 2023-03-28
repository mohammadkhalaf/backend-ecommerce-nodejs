const express = require('express');
const router = express.Router();
const {
  authUser,
  authorizePermission,
} = require('../middleware/authentication');
const {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
  getCurrentOrder,
} = require('../controllers/orderController');
router
  .route('/')
  .post(authUser, createOrder)
  .get(authUser, authorizePermission('admin'), getAllOrders);
router.route('/myorders').get(authUser, getCurrentOrder);
router.route('/:id').get(authUser, getSingleOrder).patch(authUser, updateOrder);

module.exports = router;
