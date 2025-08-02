import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

// 인벤토리 아이템 추가 (아이템 획득)
export const addToInventory = async (req, res) => {
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

    // 인벤토리에 아이템 추가
    const inventoryItem = await prisma.inventoryItem.create({
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
      message: '아이템이 인벤토리에 추가되었습니다.',
      inventoryItem: {
        id: inventoryItem.id,
        item: inventoryItem.item,
        createdAt: inventoryItem.createdAt
      }
    });

  } catch (error) {
    console.error('인벤토리 아이템 추가 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 인벤토리 조회
export const getInventory = async (req, res) => {
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

    // 인벤토리 조회
    const inventoryItems = await prisma.inventoryItem.findMany({
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
      inventory: inventoryItems.map(inv => ({
        id: inv.id,
        item: inv.item,
        acquiredAt: inv.createdAt
      }))
    });

  } catch (error) {
    console.error('인벤토리 조회 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 인벤토리에서 아이템 제거
export const removeFromInventory = async (req, res) => {
  try {
    const { characterId, inventoryItemId } = req.params;
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

    // 인벤토리 아이템 존재 확인
    const inventoryItem = await prisma.inventoryItem.findFirst({
      where: {
        id: parseInt(inventoryItemId),
        characterId: parseInt(characterId)
      }
    });

    if (!inventoryItem) {
      return res.status(404).json({
        error: '인벤토리 아이템을 찾을 수 없습니다.'
      });
    }

    // 인벤토리에서 아이템 제거
    await prisma.inventoryItem.delete({
      where: { id: parseInt(inventoryItemId) }
    });

    res.json({
      message: '아이템이 인벤토리에서 제거되었습니다.'
    });

  } catch (error) {
    console.error('인벤토리 아이템 제거 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
}; 