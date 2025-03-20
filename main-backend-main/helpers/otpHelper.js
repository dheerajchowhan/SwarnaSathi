const FormSubmission = require('../models/BeOurPartner');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (phone, otp) => {
  try {
    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
    const message = await client.messages.create({
      body: `Your OTP is ${otp}. It is valid for 10 minutes.`,
      from: twilioPhoneNumber,
      to: formattedPhone
    });
    console.log(`OTP sent to ${formattedPhone}. Message SID: ${message.sid}`);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error(`Error sending OTP to ${phone}: ${error.message}`);
    throw new Error('Failed to send OTP: ' + error.message);
  }
};

exports.sendPhoneOTP = async (phone) => {
  try {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const formSubmission = await FormSubmission.findOneAndUpdate(
      { phone },
      { otp, otpExpiresAt: expiresAt },
      { upsert: true, new: true }
    );
    await sendOTP(phone, otp);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    throw new Error('Error sending OTP: ' + error.message);
  }
};

exports.verifyPhoneOTP = async (phone, otp) => {
  try {
    const formSubmission = await FormSubmission.findOne({ phone });
    if (!formSubmission) {
      return { success: false, message: 'Phone number not found' };
    }
    if (formSubmission.otp !== otp) {
      return { success: false, message: 'Invalid OTP' };
    }
    if (formSubmission.otpExpiresAt < new Date()) {
      return { success: false, message: 'OTP has expired' };
    }

    try {
      // Use updateOne to bypass validation since we're only updating OTP-related fields
      await FormSubmission.updateOne(
        { _id: formSubmission._id },
        { 
          $set: { 
            isPhoneVerified: true,
            otp: null,
            otpExpiresAt: null
          } 
        }
      );
      
      return { success: true, message: 'Phone verified successfully' };
    } catch (saveError) {
      console.error('Error saving after OTP verification:', saveError);
      return { success: false, message: 'Error updating verification status' };
    }
  } catch (error) {
    console.error('Error in verifyPhoneOTP:', error);
    throw new Error('Error verifying OTP: ' + error.message);
  }
};