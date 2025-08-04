import prisma from '../utils/prisma/index.js';
import { verifyToken, isAccessToken } from '../utils/jwt.utils.js';

// JWT 인증 미들웨어 (Access Token 검증)
export const authenticateToken = async (req, res, next) => {
  try {
    // 현재 기기 ID 확인
    const currentDeviceId = req.cookies.currentDeviceId;
    
    // 디버깅: 쿠키 정보 로그
    console.log('🔍 인증 미들웨어 - 쿠키 정보:', {
      allCookies: req.cookies,
      currentDeviceId: currentDeviceId,
      accessToken: req.cookies[`accessToken_${currentDeviceId}`] ? '존재함' : '없음',
      refreshToken: req.cookies[`refreshToken_${currentDeviceId}`] ? '존재함' : '없음'
    });

    // 기기별 쿠키에서 토큰 추출
    const token = req.cookies[`accessToken_${currentDeviceId}`];

    if (!token) {
      console.log('❌ Access Token이 없음');
      return res.status(401).json({
        error: '액세스 토큰이 필요합니다.',
        message: '로그인이 필요합니다.'
      });
    }

    // Access Token 타입 확인
    if (!isAccessToken(token)) {
      console.log('❌ 유효하지 않은 토큰 타입');
      return res.status(401).json({
        error: '유효하지 않은 토큰 타입입니다.',
        message: 'Access Token을 사용해주세요.'
      });
    }

    // JWT 토큰 검증
    console.log('🔍 토큰 검증 시도...');
    const decoded = verifyToken(token);
    console.log('✅ 토큰 검증 성공, userId:', decoded.userId);
    
    // 사용자 정보 조회
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        userId: true,
        name: true
      }
    });

    if (!user) {
      return res.status(401).json({
        error: '유효하지 않은 토큰입니다.',
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    // req.locals에 사용자 정보 저장
    req.locals = { user };
    next();

  } catch (error) {
    if (error.message === '유효하지 않은 토큰입니다.') {
      return res.status(401).json({
        error: '유효하지 않은 토큰입니다.',
        message: '토큰 형식이 올바르지 않습니다.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: '토큰이 만료되었습니다.',
        message: 'Refresh Token을 사용하여 토큰을 갱신해주세요.'
      });
    }

    console.error('인증 미들웨어 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
}; 