const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  linkType: {
    type: String,
    enum: ['house', 'project', 'url', 'none'],
    default: 'none'
  },
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  linkUrl: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    enum: ['home', 'new', 'secondhand', 'rent'],
    default: 'home'
  },
  city: {
    type: String,
    default: ''
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

bannerSchema.index({ position: 1, city: 1, status: 1, sort: -1 });

module.exports = mongoose.model('Banner', bannerSchema);
