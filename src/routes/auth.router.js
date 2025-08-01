import express from 'express';
import { signup, login, refreshToken, logout } from '../controllers/authController.js';
import { 
  signupSchema, 
  loginSchema, 
  refreshTokenSchema, 
  logoutSchema, 
  validateRequest 
} from '../validations/auth.validation.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// 회원가입
router.post('/signup', validateRequest(signupSchema), signup);

// 로그인
router.post('/login', validateRequest(loginSchema), login);

// 토큰 갱신
router.post('/refresh', validateRequest(refreshTokenSchema), refreshToken);

// 로그아웃 (인증 필요)
router.post('/logout', authenticateToken, validateRequest(logoutSchema), logout);

export default router; 