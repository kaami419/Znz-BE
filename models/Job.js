const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    service_Title: {
      type: String,
      required: true,
    },
    minimum_budget: {
      type: String,
      required: true,
    },
    service_Description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      required: true,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        required: true,
      },
    ],
    country: {
      type: String,
      required: true,
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    min_projectLength: {
      type: Number,
      require: true,
    },
    max_projectLength: {
      type: Number,
      require: true,
    },
    proposal: {
      type: Number,
      require: false,
      default: 0,
    },
    isFavorite: {
      type: Boolean,
      require: false,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const PostJob = mongoose.model("PostJob", jobSchema);

module.exports = PostJob;
