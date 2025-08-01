import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_EXPIRES_IN = '15m'; // 15분
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // 7일

// Access Token 생성 (최소 정보만)
export const generateAccessToken = (userId) => {
  return jwt.sign(
    {
      userId,
      type: 'access'
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
};

// Refresh Token 생성 (사용자 정보 포함)
export const generateRefreshToken = (userId, userInfo = {}) => {
  return jwt.sign(
    {
      userId,
      type: 'refresh',
      ...userInfo
    },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
};

// 토큰 검증
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('유효하지 않은 토큰입니다.');
  }
};

// 토큰에서 사용자 ID 추출
export const getUserIdFromToken = (token) => {
  const decoded = verifyToken(token);
  return decoded.userId;
};

// 기기 식별자 생성 (crypto 사용)
export const generateDeviceId = (req) => {
  // 임시로 단순한 식별자 생성
  return crypto.randomBytes(16).toString('hex');
};

// 토큰 타입 확인
export const isAccessToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded && decoded.type === 'access';
  } catch {
    return false;
  }
};

export const isRefreshToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded && decoded.type === 'refresh';
  } catch {
    return false;
  }
}; 