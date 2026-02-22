const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title']
  },
  description: {
    type: String,
    required: [true, 'Please add a job description']
  },
  skills: {
    type: [String],
    required: true
  },
  salary: {
    type: Number
  },

  type: { // Full-time, Internship, etc.
    type: String,
    enum: ['Full-time', 'Internship', 'Contract', 'Part-time'],
    default: 'Full-time'
  },

  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }],

  industry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Auto-filled from User details for easier querying
  companyName: String,
  location: String,

  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);
