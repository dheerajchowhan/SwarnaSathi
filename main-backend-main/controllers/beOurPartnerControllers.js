// controllers/formSubmissions.js
const FormSubmission = require('../models/BeOurPartner');
const { sendPhoneOTP, verifyPhoneOTP } = require('../helpers/otpHelper');
const sendEmail = require('../utils/sendEmail'); // Your custom email utility

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

    // Check if the phone number is verified
    const existingSubmission = await FormSubmission.findOne({ phone });
    if (!existingSubmission || !existingSubmission.isPhoneVerified) {
      return res.status(400).json({ message: 'Phone number must be verified before submitting the form' });
    }

    // Update the existing submission with the new form data
    existingSubmission.type = type;
    existingSubmission.name = name;
    existingSubmission.pincode = type !== 'lending-partner' ? pincode : undefined;
    existingSubmission.email = type === 'lending-partner' ? email : undefined;
    existingSubmission.isSubmitted = true;
    existingSubmission.submittedAt = new Date();

    const savedSubmission = await existingSubmission.save();

    // Send thank-you email if type is lending-partner
    let emailMessage = '';
    if (type === 'lending-partner' && email) {
      const emailOptions = {
        email, // Recipient email
        subject: 'Thank You for Registering with SwrnaSathi',
        data: {
          content: `
            <h2>Welcome, ${name}!</h2>
            <p>Thank you for registering as a lending partner with SwrnaSathi. We’re excited to have you on board!</p>
            <p>Best regards,<br>SwarnaSathi Team</p>
          `,
        },
      };

      try {
        await sendEmail(emailOptions);
        emailMessage = ' and a thank-you email has been sent';
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        emailMessage = ', but email sending failed';
      }
    }

    res.status(200).json({
      submission: savedSubmission,
      message: `Registration successful${emailMessage}`,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Phone number already exists' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};



// Verify OTP for a submission
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: 'Phone is required' });
    }

    const result = await sendPhoneOTP(phone);
    if (result.success) {
      res.json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP are required' });
    }

    const result = await verifyPhoneOTP(phone, otp);
    if (result.success) {
      res.json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying OTP. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
      email: submission.type === 'lending-partner' ? (email || submission.email) : undefined,
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