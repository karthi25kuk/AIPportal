const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router(); // ✅ THIS WAS MISSING

const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const data = req.body;

    const exist = await User.findOne({ email: data.email });
    if (exist) return res.json({ msg: "User already exists" });

    const hash = await bcrypt.hash(data.password, 10);

    const user = new User({
      ...data,
      password: hash,
      status: data.role === "student" ? "approved" : "pending",
    });

    await user.save();

    res.json({ msg: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
});

// GET APPROVED COLLEGES
router.get("/colleges", async (req, res) => {
  const colleges = await User.find({
    role: "college",
    status: "approved",
  }).select("collegeName");

  res.json(colleges);
});

module.exports = router; // ✅ ALSO IMPORTANT

// --------------login----------------
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ msg: "Wrong password" });

    // ✅ Approval check ONLY for college & industry
    if (
      (user.role === "college" || user.role === "industry") &&
      user.status !== "approved"
    ) {
      return res.json({ msg: "Wait for admin approval" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      msg: "Login success",
      token,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

//------------------admin approval----------------

// GET PENDING USERS
router.get("/pending", async (req, res) => {
  const users = await User.find({ status: "pending" }).select(
    "name email role",
  );

  res.json(users);
});

// APPROVE USER
router.put("/approve/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    status: "approved",
  });

  res.json({ msg: "User approved" });
});

// REJECT USER
router.delete("/reject/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "User rejected" });
});

// ADMIN STATS
router.get("/admin/stats", async (req, res) => {
  const totalStudents = await User.countDocuments({ role: "student" });
  const approvedStudents = await User.countDocuments({
    role: "student",
    status: "approved",
  });
  const pendingStudents = await User.countDocuments({
    role: "student",
    status: "pending",
  });

  const totalColleges = await User.countDocuments({ role: "college" });
  const approvedColleges = await User.countDocuments({
    role: "college",
    status: "approved",
  });
  const pendingColleges = await User.countDocuments({
    role: "college",
    status: "pending",
  });

  const totalIndustry = await User.countDocuments({ role: "industry" });
  const approvedIndustry = await User.countDocuments({
    role: "industry",
    status: "approved",
  });
  const pendingIndustry = await User.countDocuments({
    role: "industry",
    status: "pending",
  });

  res.json({
    students: {
      total: totalStudents,
      approved: approvedStudents,
      pending: pendingStudents,
    },
    colleges: {
      total: totalColleges,
      approved: approvedColleges,
      pending: pendingColleges,
    },
    industry: {
      total: totalIndustry,
      approved: approvedIndustry,
      pending: pendingIndustry,
    },
  });
});

router.get("/pending/colleges", async (req, res) => {
  const data = await User.find({ role: "college", status: "pending" });
  res.json(data);
});

router.get("/pending/industry", async (req, res) => {
  const data = await User.find({ role: "industry", status: "pending" });
  res.json(data);
});
