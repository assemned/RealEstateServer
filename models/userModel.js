const mongoose = require("mongoose");
const bcrybt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
});

// static signup method
userSchema.statics.signup = async function (email, username, password, logo) {
  if (!email || !username || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 0,
    })
  ) {
    throw Error(
      "Password must be at least 8 characters long and contain at least one uppercase and one lowercase letter and one number"
    );
  }
  if (!validator.isLength(username, { min: 3, max: 20 })) {
    throw Error("Username must be between 3 and 20 characters");
  }

  const exictEmail = await this.findOne({ email });
  const exictUsername = await this.findOne({ username });

  if (exictEmail) {
    throw Error("Email alearedy in use");
  }
  if (exictUsername) {
    throw Error("Username alearedy in use");
  }

  const salt = await bcrybt.genSalt(10);
  const hash = await bcrybt.hash(password, salt);

  const user = await this.create({
    email,
    username,
    password: hash,
    logo,
  });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrybt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
