import express from 'express';
import { createCharacter, deleteCharacter, getCharacter } from '../controllers/characterController.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// 모든 캐릭터 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// 캐릭터 생성
router.post('/', createCharacter);

// 캐릭터 삭제
router.delete('/:characterId', deleteCharacter);

// 캐릭터 상세 조회
router.get('/:characterId', getCharacter);

export default router; 