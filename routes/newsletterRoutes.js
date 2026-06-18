const express = require("express");
const router = express.Router();
const Newsletter = require("../models/Newsletter");

router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await Newsletter.findOne({ email });

    if (existing) {
      return res.json({
        success: false,
        message: "Already subscribed",
      });
    }

    await Newsletter.create({ email });

    res.json({
      success: true,
      message: "Subscribed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;