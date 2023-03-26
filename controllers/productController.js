const createProduct = (req, res) => {
  res.send('create');
};

const getAllProducts = (req, res) => {
  res.send('get all');
};
const getSingleProduct = (req, res) => {
  res.send('get one');
};
const deleteProduct = (req, res) => {
  res.send('remove');
};
const updateProduct = (req, res) => {
  res.send('update');
};
const uploadImage = (req, res) => {
  res.send('img');
};
module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  uploadImage,
};
