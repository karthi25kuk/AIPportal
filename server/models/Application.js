const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },

  // Academic details submitted by student
  tenth: {
    type: Number,
    required: true
  },

  twelfth: {
    type: Number,
    required: true
  },

  cgpa: {
    type: Number,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  resumeLink: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  feedback: String,   // college rejection feedback

  appliedDate: {
    type: Date,
    default: Date.now
  }

});

// Prevent duplicate application
applicationSchema.index({ student: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);