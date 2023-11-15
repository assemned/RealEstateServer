const express = require("express");

const multer = require("multer");
const path = require("path");

const {
  loginUser,
  signupUser,
  getUser,
} = require("../controllers/userController");

// Upload Image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, "UserPicture_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", upload.single("file"), signupUser);

// Get a user route
router.get("/:id", getUser);

module.exports = router;
