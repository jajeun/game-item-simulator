import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyToken, 
  generateDeviceId,
  isRefreshToken 
} from '../utils/jwt.utils.js';

const prisma = new PrismaClient();

// 회원가입
export const signup = async (req, res) => {
  try {
    const { id, password, confirm, name } = req.body;

    // ID 중복 검사
    const existingUser = await prisma.user.findUnique({
      where: { userId: id }
    });

    if (existingUser) {
      return res.status(400).json({
        error: '이미 존재하는 ID입니다.'
      });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const newUser = await prisma.user.create({
      data: {
        userId: id,
        password: hashedPassword,
        name: name
      },
      select: {
        id: true,
        userId: true,
        name: true,
        createdAt: true
      }
    });

    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      user: newUser
    });

  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 로그인
export const login = async (req, res) => {
  try {
    const { id, password } = req.body;

    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { userId: id }
    });

    if (!user) {
      return res.status(401).json({
        error: 'ID 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'ID 또는 비밀번호가 올바르지 않습니다.'
      });
    }

    // 기기 정보 수집
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    const deviceId = generateDeviceId(req);

    // 기존 모든 Refresh Token 삭제 (다른 기기에서 로그인 시 보안 강화)
    await prisma.refreshToken.deleteMany({
      where: {
        userId: user.id
      }
    });

    // Access Token과 Refresh Token 생성
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id, {
      userId: user.id, // 숫자 ID 사용
      name: user.name
    });

    // Refresh Token을 데이터베이스에 저장
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7일 후 만료

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        ipAddress: ipAddress,
        userAgent: userAgent,
        deviceId: deviceId,
        expiresAt: expiresAt
      }
    });

    // 기기별 쿠키 이름 사용
    res.cookie(`accessToken_${deviceId}`, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15분
    });

    res.cookie(`refreshToken_${deviceId}`, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7일
    });

    // 현재 기기 ID 저장
    res.cookie('currentDeviceId', deviceId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7일
    });

    res.json({
      message: '로그인이 완료되었습니다.',
      user: {
        id: user.id,
        userId: user.userId,
        name: user.name
      }
    });

  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 토큰 갱신
export const refreshToken = async (req, res) => {
  try {
    const currentDeviceId = req.cookies.currentDeviceId;
    const refreshToken = req.cookies[`refreshToken_${currentDeviceId}`];

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Refresh Token이 필요합니다.'
      });
    }

    // Refresh Token 검증
    if (!isRefreshToken(refreshToken)) {
      return res.status(401).json({
        error: '유효하지 않은 Refresh Token입니다.'
      });
    }

    const decoded = verifyToken(refreshToken);
    const userId = parseInt(decoded.userId); // 숫자로 변환

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
      return res.status(401).json({
        error: '유효하지 않은 Refresh Token입니다.'
      });
    }

    // 만료 확인
    if (new Date() > storedToken.expiresAt) {
      // 만료된 토큰 삭제
      await prisma.refreshToken.delete({
        where: { id: storedToken.id }
      });
      
      return res.status(401).json({
        error: 'Refresh Token이 만료되었습니다.'
      });
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

    res.json({
      message: '토큰이 갱신되었습니다.',
      user: {
        id: storedToken.user.id,
        userId: storedToken.user.userId,
        name: storedToken.user.name
      }
    });

  } catch (error) {
    console.error('토큰 갱신 오류:', error);
    res.status(500).json({
      error: `서버 내부 오류가 발생했습니다: ${error.message}`
    });
  }
};

// 로그아웃
export const logout = async (req, res) => {
  try {
    const currentDeviceId = req.cookies.currentDeviceId;
    const refreshToken = req.cookies[`refreshToken_${currentDeviceId}`];
    const userId = req.locals.user.id;

    if (refreshToken) {
      // Refresh Token 삭제
      await prisma.refreshToken.deleteMany({
        where: {
          token: refreshToken,
          userId: userId
        }
      });
    }

    // 기기별 쿠키 삭제
    res.clearCookie(`accessToken_${currentDeviceId}`);
    res.clearCookie(`refreshToken_${currentDeviceId}`);
    res.clearCookie('currentDeviceId');

    res.json({
      message: '로그아웃이 완료되었습니다.'
    });

  } catch (error) {
    console.error('로그아웃 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
}; 