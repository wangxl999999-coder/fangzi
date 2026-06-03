const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return this.role === 'admin';
    }
  },
  nickname: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'landlord', 'agent', 'admin'],
    default: 'user'
  },
  realName: {
    type: String,
    default: ''
  },
  idCard: {
    type: String,
    default: ''
  },
  idCardFront: {
    type: String,
    default: ''
  },
  idCardBack: {
    type: String,
    default: ''
  },
  agentLicense: {
    type: String,
    default: ''
  },
  company: {
    type: String,
    default: ''
  },
  authStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  authRejectReason: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House'
  }],
  viewHistory: [{
    house: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'House'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'disabled'],
    default: 'active'
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
