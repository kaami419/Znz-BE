const mongoose= require ("mongoose");

const contactUsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
        type: String,
        required: true,
      },
    phone_no: {
      type: Number,
    }
  },
);

const contacUs = mongoose.model("contacUs", contactUsSchema);

module.exports = contacUs;