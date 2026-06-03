const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
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
  address: {
    type: String,
    required: true
  },
  location: {
    lat: Number,
    lng: Number
  },
  price: {
    type: Number,
    required: true
  },
  priceUnit: {
    type: String,
    default: '元/㎡'
  },
  totalPriceStart: {
    type: Number,
    default: 0
  },
  houseType: [{
    bedrooms: Number,
    livingrooms: Number,
    area: Number,
    price: Number,
    name: String
  }],
  areaRange: {
    min: Number,
    max: Number
  },
  developer: {
    type: String,
    required: true
  },
  propertyCompany: {
    type: String,
    default: ''
  },
  propertyFee: {
    type: String,
    default: ''
  },
  propertyYears: {
    type: Number,
    default: 70
  },
  volumeRate: {
    type: String,
    default: ''
  },
  greenRate: {
    type: String,
    default: ''
  },
  totalHouses: {
    type: Number,
    default: 0
  },
  parkingRatio: {
    type: String,
    default: ''
  },
  decoration: {
    type: String,
    enum: ['毛坯', '简装', '精装', '豪装'],
    default: '毛坯'
  },
  openDate: {
    type: Date,
    default: null
  },
  deliverDate: {
    type: Date,
    default: null
  },
  saleStatus: {
    type: String,
    enum: ['待售', '在售', '售罄'],
    default: '待售'
  },
  images: [{
    type: String
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
  surrounding: [{
    name: String,
    type: String,
    distance: String
  }],
  traffic: [{
    type: String,
    name: String,
    distance: String
  }],
  school: [{
    name: String,
    level: String,
    distance: String
  }],
  contactName: {
    type: String,
    default: ''
  },
  contactPhone: {
    type: String,
    default: ''
  },
  isHot: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

projectSchema.index({ name: 'text', city: 1, saleStatus: 1 });

module.exports = mongoose.model('Project', projectSchema);
