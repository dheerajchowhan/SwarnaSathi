const mongoose = require('mongoose');

const formSubmissionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['swarna-sathi', 'business-associate', 'lending-partner'],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/,
    unique: true
  },
  pincode: {
    type: String,
    match: /^\d{6}$/,
    required: function () {
      return this.type !== 'lending-partner';
    }
  },
  email: {
    type: String,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    required: function () {
      return this.type === 'lending-partner';
    }
  },
  role: {
    type: String,
    enum: ['swarna-sathi', 'business-associate', 'lending-partner'],
    default: function () {
      return this.type;
    }
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
    default: null
  },
  otpExpiresAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FormSubmission', formSubmissionSchema);