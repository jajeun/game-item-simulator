import express from 'express';
import { addToInventory, getInventory, removeFromInventory } from '../controllers/inventoryController.js';
import { addToInventorySchema, validateRequest } from '../validations/inventory.validation.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// 모든 인벤토리 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// 인벤토리 아이템 추가
router.post('/:characterId/items', validateRequest(addToInventorySchema), addToInventory);

// 인벤토리 조회
router.get('/:characterId', getInventory);

// 인벤토리에서 아이템 제거
router.delete('/:characterId/items/:inventoryItemId', removeFromInventory);

export default router; 