import express from 'express';
import { createItem, updateItem, getItems, getItem } from '../controllers/itemController.js';
import { createItemSchema, updateItemSchema, validateRequest } from '../validations/item.validation.js';

const router = express.Router();

// 아이템 생성 (유효성 검사 적용)
router.post('/', validateRequest(createItemSchema), createItem);

// 아이템 수정 (유효성 검사 적용)
router.put('/:itemCode', validateRequest(updateItemSchema), updateItem);

// 아이템 목록 조회
router.get('/', getItems);

// 아이템 상세 조회
router.get('/:itemCode', getItem);

export default router; 