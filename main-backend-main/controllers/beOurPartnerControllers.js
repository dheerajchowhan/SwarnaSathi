const FormSubmission = require('../models/BeOurPartner');
const { sendPhoneOTP, verifyPhoneOTP } = require('../helpers/otpHelper');

// Create a new form submission
exports.createFormSubmission = async (req, res) => {
  try {
    const { type, name, phone, pincode, email } = req.body;

    // Basic validation
    if (!type || !name || !phone) {
      return res.status(400).json({ message: 'Type, name, and phone are required' });
    }
    if (type === 'lending-partner' && !email) {
      return res.status(400).json({ message: 'Email is required for lending partner' });
    }
    if (type !== 'lending-partner' && !pincode) {
      return res.status(400).json({ message: 'Pincode is required for this type' });
    }

    const formSubmission = new FormSubmission({
      type,
      name,
      phone,
      pincode: type !== 'lending-partner' ? pincode : undefined,
      email: type === 'lending-partner' ? email : undefined
    });

    const savedSubmission = await formSubmission.save();

    // Send OTP after saving
    await sendPhoneOTP(phone);

    res.status(201).json({
      submission: savedSubmission,
      message: 'Form submitted, please verify phone with OTP'
    });
  } catch (error) {
    if (error.code === 11000) { // Duplicate phone number
      res.status(400).json({ message: 'Phone number already exists' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Verify OTP for a submission
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP are required' });
    }

    const result = await verifyPhoneOTP(phone, otp);
    if (result.success) {
      res.json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all submissions
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await FormSubmission.find();
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single submission
exports.getSubmission = async (req, res) => {
  try {
    const submission = await FormSubmission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update submission
exports.updateSubmission = async (req, res) => {
  try {
    const submission = await FormSubmission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const { name, phone, pincode, email } = req.body;
    const updateData = {
      name: name || submission.name,
      phone: phone || submission.phone,
      pincode: submission.type !== 'lending-partner' ? (pincode || submission.pincode) : undefined,
      email: submission.type === 'lending-partner' ? (email || submission.email) : undefined
    };

    const updatedSubmission = await FormSubmission.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatedSubmission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete submission
exports.deleteSubmission = async (req, res) => {
  try {
    const submission = await FormSubmission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    await FormSubmission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};