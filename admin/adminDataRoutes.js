const express = require("express");
const { Parser } = require("json2csv");

const Contact = require("../models/Contact");
const Newsletter = require("../models/Newsletter");
const adminAuthMiddleware = require("./adminAuthMiddleware");

const router = express.Router();

/*
==================================================
GET ALL CONTACTS
==================================================
*/
router.get("/contacts", adminAuthMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Fetch Contacts Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch contacts",
    });
  }
});

/*
==================================================
GET ALL NEWSLETTER SUBSCRIBERS
==================================================
*/
router.get("/newsletters", adminAuthMiddleware, async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: newsletters,
    });
  } catch (error) {
    console.error("Fetch Newsletter Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch newsletter subscribers",
    });
  }
});

/*
==================================================
GET CONTACT COUNT
==================================================
*/
router.get("/contacts/count", adminAuthMiddleware, async (req, res) => {
  try {
    const count = await Contact.countDocuments();

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Contact Count Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get contact count",
    });
  }
});

/*
==================================================
GET NEWSLETTER COUNT
==================================================
*/
router.get("/newsletters/count", adminAuthMiddleware, async (req, res) => {
  try {
    const count = await Newsletter.countDocuments();

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Newsletter Count Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get newsletter count",
    });
  }
});

/*
==================================================
DELETE CONTACT
==================================================
*/
router.delete("/contacts/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Delete Contact Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete contact",
    });
  }
});

/*
==================================================
DELETE NEWSLETTER SUBSCRIBER
==================================================
*/
router.delete(
  "/newsletters/:id",
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const newsletter =
        await Newsletter.findByIdAndDelete(req.params.id);

      if (!newsletter) {
        return res.status(404).json({
          success: false,
          message: "Newsletter subscriber not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Newsletter subscriber deleted successfully",
      });
    } catch (error) {
      console.error("Delete Newsletter Error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to delete newsletter subscriber",
      });
    }
  }
);

/*
==================================================
EXPORT CONTACTS AS CSV
==================================================
*/
router.get(
  "/contacts/export",
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const contacts = await Contact.find()
        .sort({ createdAt: -1 })
        .lean();

      const fields = [
        {
          label: "Full Name",
          value: "fullName",
        },
        {
          label: "Email",
          value: "email",
        },
        {
          label: "Company",
          value: "company",
        },
        {
          label: "Message",
          value: "message",
        },
        {
          label: "Submitted At",
          value: "createdAt",
        },
      ];

      const parser = new Parser({
        fields,
      });

      const csv = parser.parse(contacts);

      res.header("Content-Type", "text/csv");
      res.attachment("contacts.csv");

      res.send(csv);
    } catch (error) {
      console.error("Export Contacts Error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to export contacts",
      });
    }
  }
);

/*
==================================================
EXPORT NEWSLETTER SUBSCRIBERS AS CSV
==================================================
*/
router.get(
  "/newsletters/export",
  adminAuthMiddleware,
  async (req, res) => {
    try {
      const newsletters = await Newsletter.find()
        .sort({ createdAt: -1 })
        .lean();

      const fields = [
        {
          label: "Email",
          value: "email",
        },
        {
          label: "Subscribed At",
          value: "createdAt",
        },
      ];

      const parser = new Parser({
        fields,
      });

      const csv = parser.parse(newsletters);

      res.header("Content-Type", "text/csv");
      res.attachment("newsletter-subscribers.csv");

      res.send(csv);
    } catch (error) {
      console.error(
        "Export Newsletter Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to export newsletter subscribers",
      });
    }
  }
);

module.exports = router;