import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

// 아이템 생성
export const createItem = async (req, res) => {
  try {
    const { item_code, item_name, item_stat, item_price } = req.body;

    // 아이템 코드 중복 검사
    const existingItem = await prisma.item.findUnique({
      where: { itemCode: item_code }
    });

    if (existingItem) {
      return res.status(400).json({
        error: '이미 존재하는 아이템 코드입니다.'
      });
    }

    // 아이템 생성
    const newItem = await prisma.item.create({
      data: {
        itemCode: item_code,
        itemName: item_name,
        itemStat: item_stat,
        itemPrice: item_price,
        description: req.body.description || null
      },
      select: {
        id: true,
        itemCode: true,
        itemName: true,
        itemStat: true,
        itemPrice: true,
        description: true,
        createdAt: true
      }
    });

    res.status(201).json({
      message: '아이템이 생성되었습니다.',
      item: newItem
    });

  } catch (error) {
    console.error('아이템 생성 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 아이템 수정
export const updateItem = async (req, res) => {
  try {
    const { itemCode } = req.params;
    const { item_name, item_stat } = req.body;

    // 아이템 존재 확인
    const existingItem = await prisma.item.findUnique({
      where: { itemCode: parseInt(itemCode) }
    });

    if (!existingItem) {
      return res.status(404).json({
        error: '아이템을 찾을 수 없습니다.'
      });
    }

    // 아이템 수정 (item_price는 수정 불가)
    const updatedItem = await prisma.item.update({
      where: { itemCode: parseInt(itemCode) },
      data: {
        itemName: item_name,
        itemStat: item_stat,
        description: req.body.description
      },
      select: {
        id: true,
        itemCode: true,
        itemName: true,
        itemStat: true,
        itemPrice: true,
        description: true,
        updatedAt: true
      }
    });

    res.json({
      message: '아이템이 수정되었습니다.',
      item: updatedItem
    });

  } catch (error) {
    console.error('아이템 수정 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 아이템 목록 조회
export const getItems = async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      select: {
        itemCode: true,
        itemName: true,
        itemPrice: true,
        description: true
      },
      orderBy: {
        itemCode: 'asc'
      }
    });

    res.json(items);

  } catch (error) {
    console.error('아이템 목록 조회 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 아이템 상세 조회
export const getItem = async (req, res) => {
  try {
    const { itemCode } = req.params;

    const item = await prisma.item.findUnique({
      where: { itemCode: parseInt(itemCode) },
      select: {
        itemCode: true,
        itemName: true,
        itemStat: true,
        itemPrice: true,
        description: true
      }
    });

    if (!item) {
      return res.status(404).json({
        error: '아이템을 찾을 수 없습니다.'
      });
    }

    res.json(item);

  } catch (error) {
    console.error('아이템 상세 조회 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
}; 