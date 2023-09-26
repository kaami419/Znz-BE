const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostJob",
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    bidAmount: {
      type: Number,
      // required: true,
    },
    deliveryTime: {
      type: Number,
      required: false,
    },
    file: {
      type: String,
      // required: false,
    },
    githubLink: {
      // required: false,
      type: String,
    },
    duration: {
      required: true,
      type: String,
    },
    payment: {
      required: true,
      type: Number,
    },
    serviceCharges: {
      required: true,
      type: Number,
    },
    websiteLink: {
      // required: false,
      type: String,
    },
    imagesUrl: {
      // required: true,
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Proposal = mongoose.model("Proposal", proposalSchema);

module.exports = Proposal;
