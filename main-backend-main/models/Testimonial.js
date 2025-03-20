// models/Testimonial.js
const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  image: { type: String }, // Path to uploaded image (e.g., "uploads/filename.jpg")
  name: { type: String, required: true }, // Name of the person giving the testimonial
  description: { type: String }, // Additional description (optional)
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);