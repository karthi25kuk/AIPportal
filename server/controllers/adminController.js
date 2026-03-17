const User = require("../models/User");


// ================= STATS =================
const getStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });

    const totalIndustry = await User.countDocuments({ role: "industry" });
    const pendingIndustry = await User.countDocuments({
      role: "industry",
      status: "pending",
    });
    const approvedIndustry = await User.countDocuments({
      role: "industry",
      status: "approved",
    });

    res.json({
      success: true,
      data: {
        students: totalStudents,
        industries: {
          total: totalIndustry,
          approved: approvedIndustry,
          pending: pendingIndustry,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ================= GET INDUSTRIES =================
const getUsers = async (req, res) => {
  try {
    const industries = await User.find({ role: "industry" }).select("-password");

    res.json({
      success: true,
      data: industries,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ================= APPROVE / REJECT INDUSTRY =================
const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    user.status = req.body.status;

    // ⭐ save rejection feedback
    if (req.body.status === "rejected") {
      user.adminFeedback = req.body.feedback || "Rejected by admin";
    } else {
      user.adminFeedback = "";
    }

    await user.save();

    res.json({
      success: true,
      message: "Status updated",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = {
  getStats,
  getUsers,
  updateUserStatus,
};