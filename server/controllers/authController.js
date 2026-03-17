const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ================= JWT =================
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// ================= REGISTER =================
const registerUser = async (req, res) => {

  const { name, email, password, role } = req.body;

  try {

    // Allow only student & industry
    if (!['student', 'industry'].includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Invalid role"
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    let newUserData = {
      name,
      email,
      password,
      role
    };

    // ================= STUDENT =================
    if (role === "student") {

      newUserData.status = "approved";

      newUserData.studentDetails = {
        rollNumber: req.body.studentDetails?.rollNumber || "",
        department: req.body.studentDetails?.department || "",
        collegeName: "Bannari Amman Institute of Technology",
        skills: []
      };

    }

    // ================= INDUSTRY =================
    if (role === "industry") {

      newUserData.status = "pending";

      newUserData.industryDetails = {
        companyID: req.body.industryDetails?.companyID || "",
        website: req.body.industryDetails?.website || "",
        address: req.body.industryDetails?.address || "",
        companyType: req.body.industryDetails?.companyType || ""
      };

    }

    const user = await User.create(newUserData);

    // ================= STUDENT AUTO LOGIN =================
    if (role === "student") {

      return res.status(201).json({
        success: true,
        data: {
          token: generateToken(user._id),
          id: user._id,
          role: user.role,
          name: user.name,
          collegeName: user.studentDetails?.collegeName
        }
      });

    }

    // ================= INDUSTRY WAIT APPROVAL =================
    res.status(201).json({
      success: true,
      message: "Registered successfully. Wait for admin approval."
    });


  } catch (error) {

    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ================= LOGIN =================
const loginUser = async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // ⭐ INDUSTRY APPROVAL CHECK
    if (user.role === "industry" && user.status !== "approved") {

      return res.status(403).json({
        success: false,
        status: user.status,                 
        feedback: user.adminFeedback || "",  
        message:
          user.status === "pending"
            ? "Your company account is waiting for admin approval"
            : "Your company registration was rejected"
      });

    }

    // ⭐ SUCCESS LOGIN
    res.json({
      success: true,
      data: {
        token: generateToken(user._id),
        id: user._id,
        role: user.role,
        name: user.name
      }
    });

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ================= GET CURRENT USER =================
const getMe = async (req, res) => {

  try {

    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      data: user
    });

  } catch (error) {

    console.error("GETME ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

// ===================UPDATE PROFILE====================

const updateProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // update basic fields
    if (req.body.name) user.name = req.body.name;

    // ===== STUDENT =====
    if (user.role === "student" && req.body.studentDetails) {

      user.studentDetails.rollNumber =
        req.body.studentDetails.rollNumber || user.studentDetails.rollNumber;

      user.studentDetails.skills =
        req.body.studentDetails.skills || user.studentDetails.skills;

    }

    // ===== INDUSTRY =====
    if (user.role === "industry" && req.body.industryDetails) {

      user.industryDetails.companyID =
        req.body.industryDetails.companyID || user.industryDetails.companyID;

      user.industryDetails.companyType =
        req.body.industryDetails.companyType || user.industryDetails.companyType;

      user.industryDetails.website =
        req.body.industryDetails.website || user.industryDetails.website;

      user.industryDetails.address =
        req.body.industryDetails.address || user.industryDetails.address;

    }

    // ===== COLLEGE =====
if (user.role === "college" && req.body.collegeDetails) {

  if (!user.collegeDetails) user.collegeDetails = {};

  user.collegeDetails.placementOfficer =
    req.body.collegeDetails.placementOfficer || user.collegeDetails.placementOfficer;

  user.collegeDetails.contactNumber =
    req.body.collegeDetails.contactNumber || user.collegeDetails.contactNumber;

  user.collegeDetails.website =
    req.body.collegeDetails.website || user.collegeDetails.website;

  user.collegeDetails.address =
    req.body.collegeDetails.address || user.collegeDetails.address;

}

    await user.save();

    res.json({
      success: true,
      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile
};