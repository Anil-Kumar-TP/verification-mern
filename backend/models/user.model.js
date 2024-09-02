import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  dob: { type: String, required: true },
  adhaar: { type: String, required: true, unique: true },
  pan: { type: String, required: true, unique: true },
  bank: { type: String, required: true, unique: true },
  gst: { type: String, required: true, unique: true },
  pin: { type: String, required: true },
  mobileVerified: { type: Boolean, default: false },
  mobileOtp: { type: String, default: null }, // Default to null
  mobileOtpExpires: { type: Date, default: null } // Default to null
});

// Ensure OTP fields are cleared after verification
userSchema.methods.clearOtp = function() {
  this.mobileOtp = null;
  this.mobileOtpExpires = null;
  return this.save({ validateBeforeSave: false });
};

const User = mongoose.model('User', userSchema);

export default User;
