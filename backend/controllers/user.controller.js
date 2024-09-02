import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Configure your email transporter

// Configure Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.error('Twilio account SID, auth token, or phone number is missing.');
}

let twilioClient;
try {
  twilioClient = twilio(accountSid, authToken);
} catch (error) {
  console.error('Error initializing Twilio client:', error.message);
}


export const sendMobileOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    await User.findOneAndUpdate(
      { mobile },
      { 
        mobileOtp: otp, 
        mobileOtpExpires: otpExpires,
        mobileVerified: false
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (twilioClient) {
      await twilioClient.messages.create({
        body: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
        from: twilioPhoneNumber,
        to: "+917902259683", // Use the mobile number from the request
      });

      res.status(200).json({ message: 'OTP sent to mobile' });
    } else {
      res.status(500).json({ message: 'Twilio client not initialized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error sending mobile OTP', error: error.message });
  }
};



export const verifyMobileOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.mobileOtp !== otp || user.mobileOtpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update only OTP verification status
    user.mobileVerified = true;
    await user.clearOtp(); // Clear OTP fields

    res.status(200).json({ message: 'Mobile verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying mobile OTP', error: error.message });
  }
};


export const register = async (req, res) => {
  try {
    const { name, email, password, mobile, dob, adhaar, pan, bank, gst, pin } = req.body;

    // Ensure the user has been verified
const user = await User.findOne({ mobile });

    if (!user || !user.mobileVerified) {
      return res.status(400).json({ message: 'mobile must be verified before registration' });
    }

    // Update existing user with new details
    user.name = name;
    user.email = email
    user.password = await bcrypt.hash(password, 10);
    user.dob = dob;
    user.adhaar = adhaar;
    user.pan = pan;
    user.bank = bank;
    user.gst = gst;
    user.pin = pin;
    user.mobileVerified = true;

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};
