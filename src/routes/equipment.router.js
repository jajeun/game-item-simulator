import express from 'express';
import { equipItem, getEquippedItems, unequipItem } from '../controllers/equipmentController.js';
import { equipItemSchema, validateRequest } from '../validations/equipment.validation.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// 모든 장착 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// 아이템 장착
router.post('/:characterId/equip', validateRequest(equipItemSchema), equipItem);

// 장착된 아이템 조회
router.get('/:characterId', getEquippedItems);

// 아이템 해제
router.delete('/:characterId/unequip/:equippedItemId', unequipItem);

export default router; 