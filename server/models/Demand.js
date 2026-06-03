const mongoose = require('mongoose');

const demandSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['rent', 'buy'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  district: {
    type: String,
    default: ''
  },
  priceMin: {
    type: Number,
    default: 0
  },
  priceMax: {
    type: Number,
    default: 0
  },
  areaMin: {
    type: Number,
    default: 0
  },
  areaMax: {
    type: Number,
    default: 0
  },
  bedrooms: [{
    type: Number
  }],
  houseType: {
    type: String,
    default: ''
  },
  decoration: [{
    type: String
  }],
  floor: [{
    type: String
  }],
  orientation: [{
    type: String
  }],
  facilities: [{
    type: String
  }],
  description: {
    type: String,
    default: ''
  },
  contactName: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    enum: ['普通', '紧急', '非常紧急'],
    default: '普通'
  },
  viewCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'expired'],
    default: 'pending'
  },
  expireAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

demandSchema.index({ type: 1, city: 1, status: 1 });

module.exports = mongoose.model('Demand', demandSchema);
