import express from 'express';
import { sendMobileOtp,verifyMobileOtp, register } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/send-mobile-otp', sendMobileOtp);
router.post('/verify-mobile-otp', verifyMobileOtp);
router.post('/register', register);

export default router;