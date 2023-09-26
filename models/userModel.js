const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    forget_password: {
      type: String,
      required: false,
    },
    service_Title: {
      type: String,
    },
    hourly_rate: {
      type: String,
      required: false,
    },
    phone_no: {
      type: String, // Changed to String to preserve leading zeros, if any
      required: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "countries", // Corrected the reference model name to "Country"
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    service_Description: {
      type: String,
      required: false,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    account_status: {
      type: String,
      required: true,
      default: "active",
    },
    email_verification: {
      type: Boolean,
      required: true,
      default: false,
    },
    language: {
      type: String,
      required: true,
    },
    thepa: {
      type: Number,
      default: 1000,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // Added return statement to exit the function early
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
