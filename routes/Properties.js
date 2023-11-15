const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const multer = require("multer");
const path = require("path");

const {
  getProperties,
  getProperty,
  createProperty,
  deleteProperty,
  updateProperty,
} = require("../controllers/propertyController");

// Upload Image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, "Property_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

const router = express.Router();

// GET all properties
router.get("/", getProperties);

// Auth requirement
router.use(requireAuth);

// GET a property
router.get("/:id", getProperty);

// Add a property
router.post("/", upload.single("file"), createProperty);

// DELETE a property
router.delete("/:id", deleteProperty);

// UPDATE a property
router.patch("/:id", upload.single("file"), updateProperty);

module.exports = router;
