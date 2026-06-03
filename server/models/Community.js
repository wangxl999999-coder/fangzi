const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
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
  buildYear: {
    type: Number,
    default: 0
  },
  propertyType: {
    type: String,
    default: '商品房'
  },
  propertyYears: {
    type: Number,
    default: 70
  },
  developer: {
    type: String,
    default: ''
  },
  propertyCompany: {
    type: String,
    default: ''
  },
  propertyFee: {
    type: String,
    default: ''
  },
  totalBuildings: {
    type: Number,
    default: 0
  },
  totalHouses: {
    type: Number,
    default: 0
  },
  parkingRatio: {
    type: String,
    default: ''
  },
  greenRate: {
    type: String,
    default: ''
  },
  volumeRate: {
    type: String,
    default: ''
  },
  averagePrice: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
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
  hospital: [{
    name: String,
    level: String,
    distance: String
  }],
  shopping: [{
    name: String,
    type: String,
    distance: String
  }],
  isHot: {
    type: Boolean,
    default: false
  },
  houseCount: {
    type: Number,
    default: 0
  },
  rentCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

communitySchema.index({ name: 'text', city: 1 });

module.exports = mongoose.model('Community', communitySchema);
