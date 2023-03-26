const mongoose = require('mongoose');
const reviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide title'],
      maxlength: 50,
    },
    comment: {
      type: String,
      required: [true, 'Please provide text'],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true },
);
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
module.exports = mongoose.model('Review', reviewSchema);
