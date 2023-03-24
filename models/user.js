const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please provide name'],
    minlenght: 3,
    maxlength: 30,
  },

  email: {
    type: String,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
    require: [true, 'Please provide email'],
    unique: true,
  },
  password: {
    type: String,
    require: [true, 'Please provide password'],
    minlenght: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});
module.exports = mongoose.model('User', userSchema);
