const mongoose = require("mongoose");
const { Schema } = mongoose;
const category = new Schema({  
  category: {
    type: String,
    enum : [
      'Graphics & Design',
      'Programming & Tech',
      'Digital Marketing',
      'Video & Animation',
      'Photography',
      'Web Development',
      'Mobile App Development',
      'Game Development',
      'UI/UX Design',
      'Illustration',
      '3D Modeling & Rendering',
      'Data Science & Analytics',
      'Cybersecurity',
      'Content Writing & Editing',
      'Social Media Management',
      'Search Engine Optimization (SEO)',
      'E-commerce Development',
      'Virtual Reality (VR) Development',
      'Augmented Reality (AR) Development',
      'Music Production & Audio Engineering'
  ],
    require: true,
  },

});
const categories = mongoose.model("categories", category);

module.exports = categories;
