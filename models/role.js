const mongoose = require("mongoose");
const { Schema } = mongoose;
const roleSchema = new Schema({  
  role: {
    type: String,
    enum : ['admin','seller','buyer'],
    require: true,
  },

});
const role = mongoose.model("Role", roleSchema);

module.exports = role;
