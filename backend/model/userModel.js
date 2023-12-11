const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,

    validate: [validator.isEmail, "Please Enter a valid Email"],
  },

  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should have more than 4 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});


//  this is for user  password hashing . this function will run every time when user data will change
userSchema.pre("save", async function (next) {
  // without this if statment password hashed each time when data modifeid . thereFore making this if loop
  if (this.isModified("password") === false) {
    next();
  }
  // if password upadated or created then ....
  this.password = await bcrypt.hash(this.password, 10); // this points to individule user
});


userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); 
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
 
  const resetPassToken = crypto.randomBytes(20).toString("hex"); 
  
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetPassToken)
    .toString("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; 

  return resetPassToken;
};

const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;
