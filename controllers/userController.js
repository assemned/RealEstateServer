const User = require("../models/userModel");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({
      email,
      username: user.username,
      _id: user._id,
      logo: user.logo,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { email, username, password } = req.body;
  const logo = req.file ? req.file.filename : null;

  try {
    const user = await User.signup(email, username, password, logo);

    // create a token
    const token = createToken(user._id);

    res
      .status(200)
      .json({ email, username, _id: user._id, logo: user.logo, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET user
const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such User" });
  }

  const { _id, username, logo } = await User.findById(id);

  if (!username) {
    return res.status(404).json({ error: "No such User" });
  }

  res.status(200).json({ _id, username, logo });
};

module.exports = { loginUser, signupUser, getUser };
