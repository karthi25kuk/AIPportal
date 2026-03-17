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

  // ================= STUDENT DATA =================
  studentDetails: {
    type: {
      rollNumber: String,
      department: {
        type: String,
        required: function () {
          return this.role === "student";
        },
      },
      collegeName: {
        type: String,
        default: "Bannari Amman Institute of Technology",
      },
      skills: {
        type: [String],
        default: [],
      },
    },
    default: undefined,
  },
  // ================= INDUSTRY DATA =================
  industryDetails: {
    companyID: String,
    website: String,
    address: String,
    companyType: String,
  },

  // ================= COLLEGE DATA =================
  collegeDetails: {
    website: String,
    address: String,
    placementOfficer: String,
    contactNumber: String,
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: function () {
      if (this.role === "industry") return "pending";
      return "approved";
    },
  },

  adminFeedback: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ================= PASSWORD HASH =================
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ================= PASSWORD MATCH =================
userSchema.methods.matchPassword = async function (pass) {
  return bcrypt.compare(pass, this.password);
};

module.exports = mongoose.model("User", userSchema);
