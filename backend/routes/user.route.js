import express from 'express';
import { sendMobileOtp,verifyMobileOtp, register,getUser } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/send-mobile-otp', sendMobileOtp);
router.post('/verify-mobile-otp', verifyMobileOtp);
router.post('/register', register);
router.get('/user',getUser)

export default router;