import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// 환경변수 로드
dotenv.config();

// Express 앱 생성
const app = express();
const prisma = new PrismaClient();

// 포트 설정
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩 파싱

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: '🎮 게임 아이템 시뮬레이터 API 서버',
    version: '1.0.0',
    status: 'running'
  });
});

// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: '서버 내부 오류가 발생했습니다.',
    message: err.message
  });
});

// 404 핸들링
app.use('*', (req, res) => {
  res.status(404).json({
    error: '요청한 엔드포인트를 찾을 수 없습니다.',
    path: req.originalUrl
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📡 API 서버: http://localhost:${PORT}`);
  console.log(`🏥 헬스체크: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 서버를 종료합니다...');
  await prisma.$disconnect();
  process.exit(0);
});

export default app; 