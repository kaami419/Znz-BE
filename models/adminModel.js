const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Role", 
    required: true 
  },
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
