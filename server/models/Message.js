const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['system', 'appointment', 'house', 'demand', 'chat'],
    default: 'system'
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House'
  },
  demandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Demand'
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  data: {
    type: Object,
    default: {}
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

messageSchema.index({ receiverId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
