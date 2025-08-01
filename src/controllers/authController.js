import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

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

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: '로그인이 완료되었습니다.',
      token: token,
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