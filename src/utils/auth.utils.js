import prisma from './prisma/index.js';
import { 
  verifyToken, 
  isRefreshToken, 
  generateAccessToken 
} from './jwt.utils.js';

/**
 * 토큰 갱신 유틸리티 함수
 * @param {Object} req - Express request 객체
 * @param {Object} res - Express response 객체
 * @returns {Object} { success: boolean, user?: Object, error?: string }
 */
export const attemptTokenRefresh = async (req, res) => {
  try {
    const currentDeviceId = req.cookies.currentDeviceId;
    const refreshToken = req.cookies[`refreshToken_${currentDeviceId}`];

    console.log('🔄 토큰 갱신 시도...', { 
      currentDeviceId: currentDeviceId ? '존재함' : '없음',
      refreshToken: refreshToken ? '존재함' : '없음' 
    });

    if (!refreshToken) {
      return {
        success: false,
        error: 'Refresh Token이 없습니다.'
      };
    }

    // Refresh Token 타입 검증
    if (!isRefreshToken(refreshToken)) {
      return {
        success: false,
        error: '유효하지 않은 Refresh Token 타입입니다.'
      };
    }

    const decoded = verifyToken(refreshToken);
    const userId = parseInt(decoded.userId);

    // 데이터베이스에서 Refresh Token 확인
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        userId: userId
      },
      include: {
        user: {
          select: {
            id: true,
            userId: true,
            name: true
          }
        }
      }
    });

    if (!storedToken) {
      return {
        success: false,
        error: '유효하지 않은 Refresh Token입니다.'
      };
    }

    // 만료 확인
    if (new Date() > storedToken.expiresAt) {
      // 만료된 토큰 삭제
      await prisma.refreshToken.delete({
        where: { id: storedToken.id }
      });
      
      return {
        success: false,
        error: 'Refresh Token이 만료되었습니다.'
      };
    }

    // 새로운 Access Token 생성
    const newAccessToken = generateAccessToken(userId);

    // 새로운 Access Token 쿠키 설정
    res.cookie(`accessToken_${currentDeviceId}`, newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15분
    });

    console.log('✅ 토큰 갱신 성공!', { userId: storedToken.user.id });

    return {
      success: true,
      user: storedToken.user
    };

  } catch (error) {
    console.error('❌ 토큰 갱신 실패:', error);
    return {
      success: false,
      error: '토큰 갱신 중 오류가 발생했습니다.'
    };
  }
};