const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require('../controllers/productController');
const {
  authUser,
  authorizePermission,
} = require('../middleware/authentication');
router
  .route('/')
  .get(getAllProducts)
  .post([authUser, authorizePermission('admin')], createProduct);
router
  .route('/uploadImage')
  .post([authUser, authorizePermission('admin')], uploadImage);

router
  .route('/:id')
  .get(getSingleProduct)
  .patch([authUser, authorizePermission('admin')], updateProduct)
  .delete([authUser, authorizePermission('admin')], deleteProduct);

module.exports = router;
