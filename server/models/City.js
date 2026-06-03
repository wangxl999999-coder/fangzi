const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  province: {
    type: String,
    default: ''
  },
  pinyin: {
    type: String,
    default: ''
  },
  hot: {
    type: Boolean,
    default: false
  },
  sort: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

citySchema.index({ name: 1, code: 1, status: 1 });

module.exports = mongoose.model('City', citySchema);
