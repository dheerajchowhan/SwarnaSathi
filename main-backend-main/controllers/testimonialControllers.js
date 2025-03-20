// controllers/testimonialController.js
const Testimonial = require('../models/Testimonial');
const fs = require('fs');

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !req.file) {
      return res.status(400).json({ message: 'Name and image are required' });
    }

    const testimonial = new Testimonial({
      image: req.file.path, // File path from multer
      name,
      description,
    });

    const savedTestimonial = await testimonial.save();
    res.status(201).json(savedTestimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single testimonial
exports.getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    const updateData = {
      name: req.body.name || testimonial.name,
      description: req.body.description || testimonial.description,
    };

    // If new image is uploaded, delete old one and update path
    if (req.file) {
      fs.unlink(testimonial.image, (err) => {
        if (err) console.log('Error deleting old image:', err);
      });
      updateData.image = req.file.path;
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatedTestimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    // Delete image from storage
    if (testimonial.image) {
      fs.unlink(testimonial.image, (err) => {
        if (err) console.log('Error deleting image:', err);
      });
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};