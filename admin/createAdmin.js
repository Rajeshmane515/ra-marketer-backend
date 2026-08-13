const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./Admin");

// ==========================================
// CHANGE ONLY THESE VALUES
// ==========================================

const ADMIN_NAME = "Admin";
const ADMIN_EMAIL = "rahul@ramarketer.com";
const ADMIN_PASSWORD = "ramarketer@2141";

// ==========================================
// CREATE ADMIN
// ==========================================

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Check whether admin already exists
    const existingAdmin = await Admin.findOne({
      email: ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      console.log("Email:", ADMIN_EMAIL);

      await mongoose.connection.close();
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      ADMIN_PASSWORD,
      10
    );

    // Create admin
    const admin = await Admin.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
    });

    console.log("=================================");
    console.log("Admin created successfully");
    console.log("=================================");
    console.log("Name:", ADMIN_NAME);
    console.log("Email:", ADMIN_EMAIL);
    console.log("Admin ID:", admin._id);
    console.log("=================================");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);

    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin();