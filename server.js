const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const adminDataRoutes = require("./admin/adminDataRoutes");
require("dotenv").config();

const contactRoutes = require("./routes/contactRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const adminAuthRoutes = require("./admin/adminAuthRoutes");

const app = express();

app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:");
    console.error(err);
  });

app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", adminDataRoutes);

app.get("/", (req, res) => {
  res.send("RA Marketer API Running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});