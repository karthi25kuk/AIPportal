// Run once for admin creation

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    await User.create({
      name: "Super Admin",
      email: "admin@aip.com",
      password: "Admin@123",
      role: "admin",
      status: "approved"
    });

    console.log("Admin created successfully");
    process.exit();

  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });