import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './src/routes/auth.router.js';

// 환경변수 로드
dotenv.config();

// Express 앱 생성
const app = express();
const prisma = new PrismaClient();

// 포트 설정
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 라우터 설정
app.use('/auth', authRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: '🎮 게임 아이템 시뮬레이터 API 서버',
    status: '연결됨'
  });
});

// 데이터베이스 연결 확인
app.get('/db-test', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      message: '데이터베이스 연결됨',
      status: '연결됨'
    });
  } catch (error) {
    res.json({
      message: '데이터베이스 연결 실패',
      status: '연결 안됨',
      error: error.message
    });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📡 API 서버: http://localhost:${PORT}`);
});

export default app; 