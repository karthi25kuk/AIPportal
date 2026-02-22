const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI);

async function run() {
  // Admin
  await User.deleteOne({ email: "admin@aip.com" }); // remove old
  const adminHash = await bcrypt.hash("admin123", 10);
  await User.create({
    name: "Admin",
    email: "admin@aip.com",
    password: adminHash,
    role: "admin",
    status: "approved"
  });
  console.log("Admin created");

  // College
  await User.deleteOne({ role: "college" }); // remove old college
  const collegeHash = await bcrypt.hash("college123", 10); // Default password
  await User.create({
    name: "Bannari Amman Institute of Technology",
    email: "principal@bitsathy.ac.in", // Example email
    password: collegeHash,
    role: "college",
    status: "approved"
  });
  console.log("College created");

  process.exit();
}

run();
