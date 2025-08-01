import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { signupSchema, loginSchema, validateRequest } from '../validations/auth.validation.js';

const router = express.Router();

// 회원가입
router.post('/signup', validateRequest(signupSchema), signup);

// 로그인
router.post('/login', validateRequest(loginSchema), login);

export default router; 