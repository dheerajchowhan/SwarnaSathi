// routes/testimonialRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTestimonial,
  getAllTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonialControllers');
const upload = require('../utils/FileUpload'); // Import multer config

// Apply multer middleware to routes that handle file uploads
router.post('/', upload.single('image'), createTestimonial);
router.get('/', getAllTestimonials);
router.get('/:id', getTestimonial);
router.put('/:id', upload.single('image'), updateTestimonial);
router.delete('/:id', deleteTestimonial);

module.exports = router;