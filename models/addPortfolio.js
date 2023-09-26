const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    Portfolio_title: {
        type: String,
        required: true,
    },
    Portfolio_Description: {
      type: String,
      required: true,
    },
    portfolio_Document: {
        type: String,
        required: true,
    },
    cover_image: {
      type: String,
      required: true,
    },
    skills:{
        type: String,
        required: true,  
    },
    },
  {
    timestamps: true,
  }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;
