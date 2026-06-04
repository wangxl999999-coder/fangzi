const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['new', 'secondhand', 'rent_whole', 'rent_share', 'shop'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  priceUnit: {
    type: String,
    enum: ['total', 'monthly'],
    default: 'total'
  },
  area: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  livingrooms: {
    type: Number,
    default: 0
  },
  bathrooms: {
    type: Number,
    default: 0
  },
  floor: {
    type: String,
    required: true
  },
  totalFloor: {
    type: Number,
    default: 0
  },
  decoration: {
    type: String,
    enum: ['毛坯', '简装', '精装', '豪装'],
    default: '简装'
  },
  orientation: {
    type: String,
    default: ''
  },
  buildYear: {
    type: Number,
    default: 0
  },
  propertyYears: {
    type: Number,
    default: 70
  },
  propertyType: {
    type: String,
    default: '商品房'
  },
  address: {
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
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community'
  },
  communityName: {
    type: String,
    default: ''
  },
  location: {
    lat: Number,
    lng: Number
  },
  images: [{
    type: String,
    required: true
  }],
  vrUrl: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  features: [{
    type: String
  }],
  facilities: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerType: {
    type: String,
    enum: ['landlord', 'agent'],
    default: 'landlord'
  },
  contactName: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  isSpecial: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: false
  },
  isHot: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  favoriteCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'sold', 'rented', 'offline'],
    default: 'pending'
  },
  rejectReason: {
    type: String,
    default: ''
  },
  rentDeposit: {
    type: String,
    default: ''
  },
  rentPayment: {
    type: String,
    default: ''
  },
  shopType: {
    type: String,
    default: ''
  },
  shopArea: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

houseSchema.index({ title: 'text', address: 'text', communityName: 'text' });
houseSchema.index({ city: 1, type: 1, status: 1 });
houseSchema.index({ price: 1, area: 1, bedrooms: 1 });

module.exports = mongoose.model('House', houseSchema);
