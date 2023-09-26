const mongoose = require("mongoose");

const { Schema } = mongoose;
const Joblevel = new Schema(
  {
    Joblevels: {
      type: String,
      require: true,  
    },
  },
);

const jobLevel = mongoose.model("jobLevel", Joblevel);

module.exports = jobLevel;