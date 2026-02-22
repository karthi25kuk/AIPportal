const User = require('../models/User');


// ================= STATS =================
// Only meaningful stats

const getStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });

    const totalIndustry = await User.countDocuments({ role: "industry" });
    const pendingIndustry = await User.countDocuments({
      role: "industry",
      status: "pending"
    });
    const approvedIndustry = await User.countDocuments({
      role: "industry",
      status: "approved"
    });

    res.json({
      success: true,
      data: {
        students: totalStudents,
        industries: {
          total: totalIndustry,
          approved: approvedIndustry,
          pending: pendingIndustry
        }
      }
    });

  } catch (err) {
    res.status(500).json({ success:false, message:"Server error" });
  }
};



// ================= GET INDUSTRIES =================
// Admin only views industries

const getUsers = async (req, res) => {
  try {
    const industries = await User.find({ role: "industry" })
      .select("-password");

    res.json({
      success: true,
      data: industries
    });

  } catch (err) {
    res.status(500).json({ success:false, message:"Server error" });
  }
};



// ================= APPROVE / REJECT INDUSTRY =================

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved","rejected"].includes(status)) {
      return res.status(400).json({
        success:false,
        message:"Invalid status"
      });
    }

    const user = await User.findById(req.params.id);

    if (!user || user.role !== "industry") {
      return res.status(404).json({
        success:false,
        message:"Industry not found"
      });
    }

    user.status = status;
    await user.save();

    res.json({
      success:true,
      message:`Industry ${status}`
    });

  } catch (err) {
    res.status(500).json({ success:false, message:"Server error" });
  }
};



module.exports = {
  getStats,
  getUsers,
  updateUserStatus
};
