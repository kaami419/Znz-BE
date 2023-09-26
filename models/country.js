const mongoose = require("mongoose");

const { Schema } = mongoose;
const country = new Schema(
  {
    country: {
      type: String,
      require: true,
      default: null,
      
    },
  },
  { timestamps: true }

);

const countries = mongoose.model("countries", country);

module.exports = countries;