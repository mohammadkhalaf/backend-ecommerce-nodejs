const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlenght: 3,
    maxlength: 30,
  },

  email: {
    type: String,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
    required: [true, 'Please provide email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlenght: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});
userSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.compare = async function (pw) {
  return (isMatched = await bcrypt.compare(pw, this.password));
};
userSchema.methods.createToken = function () {
  const token = jwt.sign(
    { userId: this._id, name: this.name },
    process.env.SECRET,
    { expiresIn: '1d' },
  );
  return token;
};
userSchema.methods.isTokenValid = function (token) {
  return (isValid = jwt.sign(token, process.env.SECRET));
};
module.exports = mongoose.model('User', userSchema);
