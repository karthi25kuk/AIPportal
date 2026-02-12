const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: String,
  email: { type: String, unique: true },
  password: String,

  role: {
    type: String,
    enum: ["student","college","industry"],
    required: true
  },

  status: {
    type: String,
    enum: ["pending","approved"],
    default: "pending"
  },

  // STUDENT
  rollNumber: String,
  collegeName: String,

  // COLLEGE
  collegeId: String,
  collegeAddress: String,
  collegeWebsite: String,

  // INDUSTRY
  companyName: String,
  companyId: String,
  companyAddress: String,
  companyWebsite: String,

});

module.exports = mongoose.model("User", userSchema);
