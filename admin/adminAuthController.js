const Admin = require("./Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password were provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  adminLogin,
};