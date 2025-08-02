# 🎮 게임 아이템 시뮬레이터

게임 아이템 시뮬레이터는 사용자 인증, 캐릭터 관리, 아이템 시스템을 제공하는 RESTful API 서버입니다.

## ✨ 주요 기능

- **🔐 보안 인증 시스템**: JWT 기반 쿠키 인증
- **👤 사용자 관리**: 회원가입, 로그인, 로그아웃
- **🎭 캐릭터 시스템**: 캐릭터 생성, 조회, 삭제
- **⚔️ 아이템 시스템**: 아이템 생성, 인벤토리 관리, 장착/해제
- **🔄 토큰 갱신**: 자동 Access Token 갱신

## 🛠️ 기술 스택

- **Backend**: Node.js, Express.js
- **Database**: MySQL, Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: HttpOnly 쿠키, bcrypt 해싱
- **Validation**: Joi 스키마 검증

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+ 
- MySQL 8.0+
- Yarn 또는 npm

### 설치

1. **저장소 클론**
```bash
git clone https://github.com/jajeun/game-item-simulator.git
cd game-item-simulator
```

2. **의존성 설치**
```bash
yarn install
```

3. **환경 변수 설정**
```bash
# .env 파일 생성
cp .env.example .env

# 데이터베이스 연결 정보 설정
DATABASE_URL="mysql://username:password@localhost:3306/game_item_simulator"
JWT_SECRET="your-secret-key"
```

4. **데이터베이스 설정**
```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma db push
```

5. **서버 실행**
```bash
# 개발 모드
yarn dev

# 프로덕션 모드
yarn start
```

## 📡 API 사용법

### 기본 정보
- **Base URL**: `http://localhost:3000`
- **인증**: HttpOnly 쿠키 기반 JWT 인증
- **Content-Type**: `application/json`

### 빠른 시작

1. **회원가입**
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "id": "testuser",
    "password": "password123",
    "confirm": "password123",
    "name": "테스트유저"
  }'
```

2. **로그인**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "id": "testuser",
    "password": "password123"
  }' \
  -c cookies.txt
```

3. **캐릭터 생성**
```bash
curl -X POST http://localhost:3000/characters \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "character_name": "전사캐릭터"
  }'
```

## 🔐 보안 기능

- **HttpOnly 쿠키**: XSS 공격 방지
- **SameSite=Strict**: CSRF 공격 방지
- **bcrypt 해싱**: 비밀번호 안전한 저장
- **JWT 토큰**: 안전한 인증
- **기기별 토큰 관리**: 다중 기기 보안

## 📁 프로젝트 구조

```
game-item-simulator/
├── src/
│   ├── controllers/     # 비즈니스 로직
│   ├── middleware/      # 미들웨어
│   ├── routes/         # 라우터
│   ├── validations/    # 유효성 검사
│   └── utils/          # 유틸리티
├── prisma/
│   └── schema.prisma   # 데이터베이스 스키마
├── app.js              # 메인 애플리케이션
├── package.json        # 프로젝트 설정
└── README.md          # 프로젝트 문서
```

## 🧪 테스트

### API 테스트
- **Postman**: API 테스트 컬렉션 제공
- **Insomnia**: 쿠키 자동 전송 지원
- **curl**: 명령줄 테스트 가능

### 데이터베이스 테스트
```bash
# 데이터베이스 연결 확인
curl http://localhost:3000/db-test
```

## 📚 API 문서

자세한 API 문서는 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)를 참조하세요.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👨‍💻 개발자

- **이재준** - [jajeun](https://github.com/jajeun)

## 🙏 감사의 말

- Express.js 팀
- Prisma 팀
- JWT 라이브러리 개발자들 