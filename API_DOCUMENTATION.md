# 🎮 게임 아이템 시뮬레이터 API 문서

## 📋 개요
게임 아이템 시뮬레이터 API는 사용자 인증, 캐릭터 관리, 아이템 관리를 위한 RESTful API입니다.

## 🚀 기본 정보
- **Base URL**: `http://localhost:3000`
- **Content-Type**: `application/json`
- **인증 방식**: JWT Bearer Token

## 📚 API 엔드포인트

### 🔐 인증 API

#### 1. 회원가입
```http
POST /auth/signup
```

**Request Body:**
```json
{
  "id": "user123",
  "password": "password123",
  "confirm": "password123",
  "name": "홍길동"
}
```

**Response (201):**
```json
{
  "message": "회원가입이 완료되었습니다.",
  "user": {
    "id": 1,
    "userId": "user123",
    "name": "홍길동",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. 로그인
```http
POST /auth/login
```

**Request Body:**
```json
{
  "id": "user123",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "로그인이 완료되었습니다.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "userId": "user123",
    "name": "홍길동"
  }
}
```

### 👤 캐릭터 API

**인증 필요**: 모든 캐릭터 API는 `Authorization: Bearer <token>` 헤더가 필요합니다.

#### 1. 캐릭터 생성
```http
POST /characters
```

**Request Body:**
```json
{
  "character_name": "전사"
}
```

**Response (201):**
```json
{
  "message": "캐릭터가 생성되었습니다.",
  "character": {
    "id": 1,
    "characterName": "전사",
    "health": 500,
    "power": 100,
    "money": 10000,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. 캐릭터 삭제
```http
DELETE /characters/:characterId
```

**Response (200):**
```json
{
  "message": "캐릭터가 삭제되었습니다."
}
```

#### 3. 캐릭터 상세 조회
```http
GET /characters/:characterId
```

**Response (200):**
```json
{
  "character": {
    "id": 1,
    "characterName": "전사",
    "health": 500,
    "power": 100,
    "money": 10000,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 🎒 아이템 API

#### 1. 아이템 생성
```http
POST /items
```

**Request Body:**
```json
{
  "item_code": 1,
  "item_name": "강화된 검",
  "item_stat": {
    "health": 50,
    "power": 20
  },
  "item_price": 1000,
  "description": "강력한 공격력을 가진 검입니다."
}
```

**Response (201):**
```json
{
  "message": "아이템이 생성되었습니다.",
  "item": {
    "id": 1,
    "itemCode": 1,
    "itemName": "강화된 검",
    "itemStat": {
      "health": 50,
      "power": 20
    },
    "itemPrice": 1000,
    "description": "강력한 공격력을 가진 검입니다.",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. 아이템 수정
```http
PUT /items/:itemCode
```

**Request Body:**
```json
{
  "item_name": "매우 강화된 검",
  "item_stat": {
    "health": 100,
    "power": 50
  },
  "description": "매우 강력한 공격력을 가진 검입니다."
}
```

**Response (200):**
```json
{
  "message": "아이템이 수정되었습니다.",
  "item": {
    "id": 1,
    "itemCode": 1,
    "itemName": "매우 강화된 검",
    "itemStat": {
      "health": 100,
      "power": 50
    },
    "itemPrice": 1000,
    "description": "매우 강력한 공격력을 가진 검입니다.",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3. 아이템 목록 조회
```http
GET /items
```

**Response (200):**
```json
[
  {
    "itemCode": 1,
    "itemName": "강화된 검",
    "itemPrice": 1000,
    "description": "강력한 공격력을 가진 검입니다."
  },
  {
    "itemCode": 2,
    "itemName": "마법 지팡이",
    "itemPrice": 1500,
    "description": "마법 공격력을 증폭시키는 지팡이입니다."
  }
]
```

#### 4. 아이템 상세 조회
```http
GET /items/:itemCode
```

**Response (200):**
```json
{
  "itemCode": 1,
  "itemName": "강화된 검",
  "itemStat": {
    "health": 50,
    "power": 20
  },
  "itemPrice": 1000,
  "description": "강력한 공격력을 가진 검입니다."
}
```

### 🎒 인벤토리 API

**인증 필요**: 모든 인벤토리 API는 `Authorization: Bearer <token>` 헤더가 필요합니다.

#### 1. 인벤토리 아이템 추가
```http
POST /inventory/:characterId/items
```

**Request Body:**
```json
{
  "itemCode": 1
}
```

**Response (201):**
```json
{
  "message": "아이템이 인벤토리에 추가되었습니다.",
  "inventoryItem": {
    "id": 1,
    "item": {
      "itemCode": 1,
      "itemName": "강화된 검",
      "itemStat": {
        "health": 50,
        "power": 20
      },
      "itemPrice": 1000,
      "description": "강력한 공격력을 가진 검입니다."
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. 인벤토리 조회
```http
GET /inventory/:characterId
```

**Response (200):**
```json
{
  "characterId": 1,
  "inventory": [
    {
      "id": 1,
      "item": {
        "itemCode": 1,
        "itemName": "강화된 검",
        "itemStat": {
          "health": 50,
          "power": 20
        },
        "itemPrice": 1000,
        "description": "강력한 공격력을 가진 검입니다."
      },
      "acquiredAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 3. 인벤토리에서 아이템 제거
```http
DELETE /inventory/:characterId/items/:inventoryItemId
```

**Response (200):**
```json
{
  "message": "아이템이 인벤토리에서 제거되었습니다."
}
```

### 🔧 장착 시스템 API

**인증 필요**: 모든 장착 API는 `Authorization: Bearer <token>` 헤더가 필요합니다.

#### 1. 아이템 장착
```http
POST /equipment/:characterId/equip
```

**Request Body:**
```json
{
  "itemCode": 1
}
```

**Response (201):**
```json
{
  "message": "아이템이 장착되었습니다.",
  "equippedItem": {
    "id": 1,
    "item": {
      "itemCode": 1,
      "itemName": "강화된 검",
      "itemStat": {
        "health": 50,
        "power": 20
      },
      "itemPrice": 1000,
      "description": "강력한 공격력을 가진 검입니다."
    },
    "equippedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. 장착된 아이템 조회
```http
GET /equipment/:characterId
```

**Response (200):**
```json
{
  "characterId": 1,
  "equippedItems": [
    {
      "id": 1,
      "item": {
        "itemCode": 1,
        "itemName": "강화된 검",
        "itemStat": {
          "health": 50,
          "power": 20
        },
        "itemPrice": 1000,
        "description": "강력한 공격력을 가진 검입니다."
      },
      "equippedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 3. 아이템 해제
```http
DELETE /equipment/:characterId/unequip/:equippedItemId
```

**Response (200):**
```json
{
  "message": "아이템이 해제되었습니다."
}
```

### 🏥 헬스체크 API

#### 1. 서버 상태 확인
```http
GET /health
```

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### 2. 데이터베이스 연결 확인
```http
GET /db-test
```

**Response (200):**
```json
{
  "message": "데이터베이스 연결됨",
  "status": "연결됨"
}
```

## 🔧 에러 응답

### 공통 에러 형식
```json
{
  "error": "에러 제목",
  "message": "상세 에러 메시지"
}
```

### HTTP 상태 코드
- `200`: 성공
- `201`: 생성 성공
- `400`: 잘못된 요청 (유효성 검사 실패)
- `401`: 인증 실패
- `404`: 리소스를 찾을 수 없음
- `500`: 서버 내부 오류

### 유효성 검사 에러
```json
{
  "error": "유효성 검사 실패",
  "messages": [
    "ID는 영어와 숫자만 사용 가능합니다.",
    "비밀번호는 최소 6자 이상이어야 합니다."
  ]
}
```

## 🚀 Insomnia API 클라이언트 사용 예시

### 1. 회원가입 및 로그인

#### 1-1. 회원가입
**Method**: `POST`  
**URL**: `http://localhost:3000/auth/signup`  
**Headers**: 
```
Content-Type: application/json
```
**Body**:
```json
{
  "id": "testuser",
  "password": "password123",
  "confirm": "password123",
  "name": "테스트 사용자"
}
```
**예상 결과 (201)**:
```json
{
  "message": "회원가입이 완료되었습니다.",
  "user": {
    "id": 1,
    "userId": "testuser",
    "name": "테스트 사용자",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 1-2. 로그인
**Method**: `POST`  
**URL**: `http://localhost:3000/auth/login`  
**Headers**: 
```
Content-Type: application/json
```
**Body**:
```json
{
  "id": "testuser",
  "password": "password123"
}
```
**예상 결과 (200)**:
```json
{
  "message": "로그인이 완료되었습니다.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "userId": "testuser",
    "name": "테스트 사용자"
  }
}
```

### 2. 캐릭터 관리

#### 2-1. 캐릭터 생성
**Method**: `POST`  
**URL**: `http://localhost:3000/characters`  
**Headers**: 
```
Content-Type: application/json
Authorization: Bearer {{token}}
```
**Body**:
```json
{
  "character_name": "전사"
}
```
**예상 결과 (201)**:
```json
{
  "message": "캐릭터가 생성되었습니다.",
  "character": {
    "id": 1,
    "characterName": "전사",
    "health": 500,
    "power": 100,
    "money": 10000,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2-2. 캐릭터 조회
**Method**: `GET`  
**URL**: `http://localhost:3000/characters/{{characterId}}`  
**Headers**: 
```
Authorization: Bearer {{token}}
```
**예상 결과 (200)**:
```json
{
  "character": {
    "id": 1,
    "characterName": "전사",
    "health": 500,
    "power": 100,
    "money": 10000,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2-3. 캐릭터 삭제
**Method**: `DELETE`  
**URL**: `http://localhost:3000/characters/{{characterId}}`  
**Headers**: 
```
Authorization: Bearer {{token}}
```
**예상 결과 (200)**:
```json
{
  "message": "캐릭터가 삭제되었습니다."
}
```

### 3. 아이템 관리

#### 3-1. 아이템 생성
**Method**: `POST`  
**URL**: `http://localhost:3000/items`  
**Headers**: 
```
Content-Type: application/json
```
**Body**:
```json
{
  "item_code": 1,
  "item_name": "강화된 검",
  "item_stat": {
    "health": 50,
    "power": 20
  },
  "item_price": 1000,
  "description": "강력한 공격력을 가진 검입니다."
}
```
**예상 결과 (201)**:
```json
{
  "message": "아이템이 생성되었습니다.",
  "item": {
    "id": 1,
    "itemCode": 1,
    "itemName": "강화된 검",
    "itemStat": {
      "health": 50,
      "power": 20
    },
    "itemPrice": 1000,
    "description": "강력한 공격력을 가진 검입니다.",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3-2. 아이템 목록 조회
**Method**: `GET`  
**URL**: `http://localhost:3000/items`  
**예상 결과 (200)**:
```json
[
  {
    "itemCode": 1,
    "itemName": "강화된 검",
    "itemPrice": 1000,
    "description": "강력한 공격력을 가진 검입니다."
  },
  {
    "itemCode": 2,
    "itemName": "마법 지팡이",
    "itemPrice": 1500,
    "description": "마법 공격력을 증폭시키는 지팡이입니다."
  }
]
```

#### 3-3. 아이템 상세 조회
**Method**: `GET`  
**URL**: `http://localhost:3000/items/{{itemCode}}`  
**예상 결과 (200)**:
```json
{
  "itemCode": 1,
  "itemName": "강화된 검",
  "itemStat": {
    "health": 50,
    "power": 20
  },
  "itemPrice": 1000,
  "description": "강력한 공격력을 가진 검입니다."
}
```

#### 3-4. 아이템 수정
**Method**: `PUT`  
**URL**: `http://localhost:3000/items/{{itemCode}}`  
**Headers**: 
```
Content-Type: application/json
```
**Body**:
```json
{
  "item_name": "매우 강화된 검",
  "item_stat": {
    "health": 100,
    "power": 50
  },
  "description": "매우 강력한 공격력을 가진 검입니다."
}
```
**예상 결과 (200)**:
```json
{
  "message": "아이템이 수정되었습니다.",
  "item": {
    "id": 1,
    "itemCode": 1,
    "itemName": "매우 강화된 검",
    "itemStat": {
      "health": 100,
      "power": 50
    },
    "itemPrice": 1000,
    "description": "매우 강력한 공격력을 가진 검입니다.",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. 인벤토리 관리

#### 4-1. 인벤토리 아이템 추가
**Method**: `POST`  
**URL**: `http://localhost:3000/inventory/{{characterId}}/items`  
**Headers**: 
```
Content-Type: application/json
Authorization: Bearer {{token}}
```
**Body**:
```json
{
  "itemCode": 1
}
```
**예상 결과 (201)**:
```json
{
  "message": "아이템이 인벤토리에 추가되었습니다.",
  "inventoryItem": {
    "id": 1,
    "item": {
      "itemCode": 1,
      "itemName": "강화된 검",
      "itemStat": {
        "health": 50,
        "power": 20
      },
      "itemPrice": 1000,
      "description": "강력한 공격력을 가진 검입니다."
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 4-2. 인벤토리 조회
**Method**: `GET`  
**URL**: `http://localhost:3000/inventory/{{characterId}}`  
**Headers**: 
```
Authorization: Bearer {{token}}
```
**예상 결과 (200)**:
```json
{
  "characterId": 1,
  "inventory": [
    {
      "id": 1,
      "item": {
        "itemCode": 1,
        "itemName": "강화된 검",
        "itemStat": {
          "health": 50,
          "power": 20
        },
        "itemPrice": 1000,
        "description": "강력한 공격력을 가진 검입니다."
      },
      "acquiredAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 4-3. 인벤토리에서 아이템 제거
**Method**: `DELETE`  
**URL**: `http://localhost:3000/inventory/{{characterId}}/items/{{inventoryItemId}}`  
**Headers**: 
```
Authorization: Bearer {{token}}
```
**예상 결과 (200)**:
```json
{
  "message": "아이템이 인벤토리에서 제거되었습니다."
}
```

### 5. 장착 시스템

#### 5-1. 아이템 장착
**Method**: `POST`  
**URL**: `http://localhost:3000/equipment/{{characterId}}/equip`  
**Headers**: 
```
Content-Type: application/json
Authorization: Bearer {{token}}
```
**Body**:
```json
{
  "itemCode": 1
}
```
**예상 결과 (201)**:
```json
{
  "message": "아이템이 장착되었습니다.",
  "equippedItem": {
    "id": 1,
    "item": {
      "itemCode": 1,
      "itemName": "강화된 검",
      "itemStat": {
        "health": 50,
        "power": 20
      },
      "itemPrice": 1000,
      "description": "강력한 공격력을 가진 검입니다."
    },
    "equippedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 5-2. 장착된 아이템 조회
**Method**: `GET`  
**URL**: `http://localhost:3000/equipment/{{characterId}}`  
**Headers**: 
```
Authorization: Bearer {{token}}
```
**예상 결과 (200)**:
```json
{
  "characterId": 1,
  "equippedItems": [
    {
      "id": 1,
      "item": {
        "itemCode": 1,
        "itemName": "강화된 검",
        "itemStat": {
          "health": 50,
          "power": 20
        },
        "itemPrice": 1000,
        "description": "강력한 공격력을 가진 검입니다."
      },
      "equippedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 5-3. 아이템 해제
**Method**: `DELETE`  
**URL**: `http://localhost:3000/equipment/{{characterId}}/unequip/{{equippedItemId}}`  
**Headers**: 
```
Authorization: Bearer {{token}}
```
**예상 결과 (200)**:
```json
{
  "message": "아이템이 해제되었습니다."
}
```

### 6. 시스템 상태 확인

#### 6-1. 서버 상태
**Method**: `GET`  
**URL**: `http://localhost:3000/`  
**예상 결과 (200)**:
```json
{
  "message": "🎮 게임 아이템 시뮬레이터 API 서버",
  "status": "연결됨"
}
```

#### 6-2. 데이터베이스 연결 확인
**Method**: `GET`  
**URL**: `http://localhost:3000/db-test`  
**예상 결과 (200)**:
```json
{
  "message": "데이터베이스 연결됨",
  "status": "연결됨"
}
```


## 🔧 Insomnia 환경 변수 설정

Insomnia에서 다음 환경 변수를 설정하면 더 편리합니다:

**Environment Variables:**
- `baseUrl`: `http://localhost:3000`
- `token`: (로그인 후 받은 JWT 토큰)
- `characterId`: (생성된 캐릭터 ID)
- `itemCode`: (생성된 아이템 코드)
- `inventoryItemId`: (인벤토리 아이템 ID)
- `equippedItemId`: (장착된 아이템 ID)

**사용법**: URL에서 `{{변수명}}` 형태로 사용
- `{{baseUrl}}/auth/login`
- `{{baseUrl}}/characters/{{characterId}}`
- `{{baseUrl}}/inventory/{{characterId}}/items/{{inventoryItemId}}`
- `{{baseUrl}}/equipment/{{characterId}}/unequip/{{equippedItemId}}`

## 📝 주의사항

1. **인증**: 캐릭터 API는 반드시 JWT 토큰이 필요합니다.
2. **아이템 가격**: 아이템 수정 시 `item_price`는 변경할 수 없습니다.
3. **캐릭터 소유권**: 자신의 캐릭터만 삭제할 수 있습니다.
4. **아이템 코드**: 아이템 코드는 고유해야 합니다.
5. **JSON 스탯**: 아이템 스탯은 JSON 객체 형태로 저장됩니다.
6. **장착 조건**: 인벤토리에 있는 아이템만 장착할 수 있습니다. 