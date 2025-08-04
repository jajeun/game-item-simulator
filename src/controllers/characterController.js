import prisma from '../utils/prisma/index.js';

// 캐릭터 생성
export const createCharacter = async (req, res) => {
  try {
    const { character_name } = req.body;
    const userId = req.locals.user.id;

    // 유효성 검사
    if (!character_name) {
      return res.status(400).json({
        error: '캐릭터 이름을 입력해주세요.'
      });
    }

    // 캐릭터 이름 중복 검사
    const existingCharacter = await prisma.character.findUnique({
      where: { characterName: character_name }
    });

    if (existingCharacter) {
      return res.status(400).json({
        error: '이미 존재하는 캐릭터 이름입니다.'
      });
    }

    // 캐릭터 생성 (기본 스탯: health: 500, power: 100, money: 10000)
    const newCharacter = await prisma.character.create({
      data: {
        characterName: character_name,
        health: 500,
        power: 100,
        money: 10000,
        userId: userId
      },
      select: {
        id: true,
        characterName: true,
        health: true,
        power: true,
        money: true,
        createdAt: true
      }
    });

    res.status(201).json({
      message: '캐릭터가 생성되었습니다.',
      character: newCharacter
    });

  } catch (error) {
    console.error('캐릭터 생성 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 캐릭터 삭제
export const deleteCharacter = async (req, res) => {
  try {
    const { characterId } = req.params;
    const userId = req.locals.user.id;

    // 캐릭터 존재 확인 및 소유권 확인
    const character = await prisma.character.findFirst({
      where: {
        id: parseInt(characterId),
        userId: userId
      }
    });

    if (!character) {
      return res.status(404).json({
        error: '캐릭터를 찾을 수 없거나 삭제 권한이 없습니다.'
      });
    }

    // 캐릭터 삭제
    await prisma.character.delete({
      where: { id: parseInt(characterId) }
    });

    res.json({
      message: '캐릭터가 삭제되었습니다.'
    });

  } catch (error) {
    console.error('캐릭터 삭제 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
};

// 캐릭터 상세 조회
export const getCharacter = async (req, res) => {
  try {
    const { characterId } = req.params;
    const userId = req.locals.user.id;

    // 캐릭터 조회
    const character = await prisma.character.findUnique({
      where: { id: parseInt(characterId) },
      include: {
        user: {
          select: {
            id: true,
            userId: true,
            name: true
          }
        }
      }
    });

    if (!character) {
      return res.status(404).json({
        error: '캐릭터를 찾을 수 없습니다.'
      });
    }

    // 내 캐릭터인지 확인
    const isMyCharacter = character.userId === userId;

    // 응답 데이터 구성
    const responseData = {
      id: character.id,
      characterName: character.characterName,
      health: character.health,
      power: character.power,
      createdAt: character.createdAt
    };

    // 내 캐릭터인 경우에만 money 정보 포함
    if (isMyCharacter) {
      responseData.money = character.money;
    }

    res.json({
      character: responseData
    });

  } catch (error) {
    console.error('캐릭터 조회 오류:', error);
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
}; 