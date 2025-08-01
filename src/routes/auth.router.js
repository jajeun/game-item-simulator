import express from 'express';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

// 회원가입
router.post('/signup', signup);

// 로그인
router.post('/login', login);

export default router; 