const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House',
    required: true
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  remark: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  cancelReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

appointmentSchema.index({ userId: 1, houseId: 1, status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
