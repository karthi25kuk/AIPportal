const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },

  role: {
    type: String,
    enum: ["student", "industry", "college", "admin"],
    default: "student",
  },

  // ✅ STUDENT DATA
  studentDetails: {
    rollNumber: String,
    collegeName: {
      type: String,
      default: "Bannari Amman Institute of Technology"
    },
    skills: [String],
  },

  // ✅ INDUSTRY DATA
  industryDetails: {
    companyName: String,
    website: String,
    address: String,
    industryType: String,
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: function () {
      if (this.role === "industry") return "pending";
      return "approved"; // student, college, admin
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔐 Hash Password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔐 Compare Password
userSchema.methods.matchPassword = async function (pass) {
  return bcrypt.compare(pass, this.password);
};

module.exports = mongoose.model("User", userSchema);
