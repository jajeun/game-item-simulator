import prisma from '../utils/prisma/index.js';

// 아이템 장착
export const equipItem = async (req, res) => {
  try {
    const { characterId } = req.params;
    const { itemCode } = req.body;
    const userId = req.locals.user.id;

    // 캐릭터 소유권 확인
    const character = await prisma.character.findFirst({
      where: {
        id: parseInt(characterId),
        userId: userId
      }
    });

    if (!character) {
      return res.status(404).json({
        error: '캐릭터를 찾을 수 없거나 접근 권한이 없습니다.'
      });
    }

    // 아이템 존재 확인
    const item = await prisma.item.findUnique({
      where: { itemCode: parseInt(itemCode) }
    });

    if (!item) {
      return res.status(404).json({
        error: '아이템을 찾을 수 없습니다.'
      });
    }

    // 인벤토리에서 아이템 확인
    const inventoryItem = await prisma.inventoryItem.findFirst({
      where: {
        characterId: parseInt(characterId),
        itemId: item.id
      }
    });

    if (!inventoryItem) {
      return res.status(400).json({
        error: '인벤토리에 해당 아이템이 없습니다.'
      });
    }

    // 이미 장착된 아이템인지 확인
    const existingEquipped = await prisma.equippedItem.findFirst({
      where: {
        characterId: parseInt(characterId),
        itemId: item.id
      }
    });

    if (existingEquipped) {
      return res.status(400).json({
        error: '이미 장착된 아이템입니다.'
      });
    }

    // 아이템 장착
    const equippedItem = await prisma.equippedItem.create({
      data: {
        characterId: parseInt(characterId),
        itemId: item.id
      },
      include: {
        item: {
          select: {
            itemCode: true,
            itemName: true,
            itemStat: true,
            itemPrice: true,
            description: true
          }
        }
      }
    });

    res.status(201).json({
      message: '아이템이 장착되었습니다.',
      equippedItem: {
        id: equippedItem.id,
        item: equippedItem.item,
        equippedAt: equippedItem.createdAt
      }
    });

  } catch (error) {
    console.error('아이템 장착 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 장착된 아이템 목록 조회
export const getEquippedItems = async (req, res) => {
  try {
    const { characterId } = req.params;
    const userId = req.locals.user.id;

    // 캐릭터 소유권 확인
    const character = await prisma.character.findFirst({
      where: {
        id: parseInt(characterId),
        userId: userId
      }
    });

    if (!character) {
      return res.status(404).json({
        error: '캐릭터를 찾을 수 없거나 접근 권한이 없습니다.'
      });
    }

    // 장착된 아이템 조회
    const equippedItems = await prisma.equippedItem.findMany({
      where: {
        characterId: parseInt(characterId)
      },
      include: {
        item: {
          select: {
            itemCode: true,
            itemName: true,
            itemStat: true,
            itemPrice: true,
            description: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      characterId: parseInt(characterId),
      equippedItems: equippedItems.map(eq => ({
        id: eq.id,
        item: eq.item,
        equippedAt: eq.createdAt
      }))
    });

  } catch (error) {
    console.error('장착된 아이템 조회 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 아이템 해제
export const unequipItem = async (req, res) => {
  try {
    const { characterId, equippedItemId } = req.params;
    const userId = req.locals.user.id;

    // 캐릭터 소유권 확인
    const character = await prisma.character.findFirst({
      where: {
        id: parseInt(characterId),
        userId: userId
      }
    });

    if (!character) {
      return res.status(404).json({
        error: '캐릭터를 찾을 수 없거나 접근 권한이 없습니다.'
      });
    }

    // 장착된 아이템 존재 확인
    const equippedItem = await prisma.equippedItem.findFirst({
      where: {
        id: parseInt(equippedItemId),
        characterId: parseInt(characterId)
      }
    });

    if (!equippedItem) {
      return res.status(404).json({
        error: '장착된 아이템을 찾을 수 없습니다.'
      });
    }

    // 아이템 해제
    await prisma.equippedItem.delete({
      where: { id: parseInt(equippedItemId) }
    });

    res.json({
      message: '아이템이 해제되었습니다.'
    });

  } catch (error) {
    console.error('아이템 해제 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
}; 