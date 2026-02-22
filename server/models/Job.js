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

  salary: Number,

  type: {
    type: String,
    enum: ['Full-time', 'Internship', 'Contract', 'Part-time'],
    default: 'Full-time'
  },

  industry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  companyName: String,   // auto-filled from industry user
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