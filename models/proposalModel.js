const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const proposalSchema = new mongoose.Schema(
  {
    totalBids: {
      type: Number,
      required: true,
    },
    servicesFee: {
      type: Number,
      required: true,
    },
    payment: {
      type: Number,
      required: true,
    },
    projectDuration: {
      type: Number,
      required: true,
      
    },
    coverLetter: {
        type: String,
        required: true,  
      },
    websiteLink: {
      type: String,
      required: false,
    },
    attachment: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);



const proposal = mongoose.model("proposal", proposalSchema);

module.exports = proposal;