import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.router.js';
import characterRoutes from './routes/character.router.js';
import itemRoutes from './routes/item.router.js';
import inventoryRoutes from './routes/inventory.router.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

// 환경변수 로드
dotenv.config();

// Express 앱 생성
const app = express();
const prisma = new PrismaClient();

// 포트 설정
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors()); 
app.use(express.json()); // JSON 파싱

// 라우터 설정
app.use('/auth', authRoutes);
app.use('/characters', characterRoutes);
app.use('/items', itemRoutes);
app.use('/inventory', inventoryRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: '게임 아이템 시뮬레이터 API 서버',
    version: '1.0.0',
    status: 'running'
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

// 에러 핸들링 미들웨어 (라우터 이후에 배치)
app.use(notFoundHandler);
app.use(errorHandler);

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`API 서버: http://localhost:${PORT}`);
  console.log(`데이터베이스 테스트: http://localhost:${PORT}/db-test`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n서버를 종료합니다...');
  await prisma.$disconnect();
  process.exit(0);
});

export default app; 