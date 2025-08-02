# 🔧 게임 아이템 시뮬레이터 트러블슈팅 가이드

## 📋 개요
이 문서는 게임 아이템 시뮬레이터 개발 과정에서 발생한 주요 문제들과 해결 방법을 정리한 것입니다.

## 🔐 인증 시스템 문제 및 해결

### 1️⃣ Authorization 헤더 → HttpOnly 쿠키 전환

#### 🚨 문제 상황
- **초기 구현**: JWT 토큰을 Authorization 헤더로 전송
- **보안 위험**: XSS 공격으로 토큰 탈취 가능
- **사용성 문제**: 클라이언트에서 매번 헤더 설정 필요

#### 🔍 문제 분석
```javascript
// 기존 방식 (취약)
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**위험 요소:**
- JavaScript로 토큰 접근 가능 → XSS 공격 취약
- 매번 헤더 설정 필요 → 사용성 저하
- 토큰 노출 위험 → 보안성 저하

#### ✅ 해결 방법

**1. 쿠키 기반 인증 구현**
```javascript
// src/controllers/authController.js
// 로그인 시 쿠키 설정
res.cookie('accessToken', accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000 // 15분
});

res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7일
});
```

**2. 미들웨어 수정**
```javascript
// src/middleware/auth.middleware.js
// 쿠키에서 토큰 추출
const token = req.cookies.accessToken;
```

**3. CORS 설정 업데이트**
```javascript
// app.js
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:3000',
  credentials: true // 쿠키 전송을 위해 필요
}));
```

#### 🎯 해결 효과
- **보안 강화**: HttpOnly 쿠키로 XSS 공격 방지
- **사용성 개선**: 자동 토큰 전송
- **SameSite=Strict**: CSRF 공격 방지

### 2️⃣ Prisma 클라이언트 경로 문제

#### 🚨 문제 상황
```bash
TypeError: Cannot read properties of undefined (reading 'deleteMany')
```

#### 🔍 문제 분석
**원인**: Prisma 클라이언트 import 경로 오류
```javascript
// 잘못된 import
import { PrismaClient } from '../../generated/prisma/index.js';
```

**문제점:**
- 커스텀 output 경로 설정으로 인한 복잡성
- 파일 경로 불일치
- Prisma 클라이언트 초기화 실패

#### ✅ 해결 방법

**1. Prisma 스키마 수정**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  // output = "../generated/prisma" 제거
}
```

**2. Import 경로 수정**
```javascript
// 모든 파일에서
import { PrismaClient } from '@prisma/client';
```

**3. 클라이언트 재생성**
```bash
# 기존 generated 폴더 삭제
rm -rf generated/

# Prisma 클라이언트 재생성
npx prisma generate
```

#### 🎯 해결 효과
- **안정성**: 표준 Prisma 클라이언트 사용
- **단순성**: 복잡한 경로 설정 제거
- **호환성**: 모든 환경에서 일관된 동작

### 3️⃣ userId 타입 불일치 문제

#### 🚨 문제 상황
```bash
PrismaClientValidationError: Argument userId: Invalid value provided. Expected IntFilter or Int, provided String.
```

#### 🔍 문제 분석
**원인**: Refresh Token의 userId 타입 불일치
```javascript
// 문제 코드
const decoded = verifyToken(refreshToken);
const userId = decoded.userId; // String 타입
// Prisma는 Int 타입 기대
```

#### ✅ 해결 방법

**1. 토큰 생성 시 타입 통일**
```javascript
// src/controllers/authController.js
const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id }, // user.id (Int) 사용
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
```

**2. 토큰 검증 시 타입 변환**
```javascript
// src/controllers/authController.js
const decoded = verifyToken(refreshToken);
const userId = parseInt(decoded.userId); // 숫자로 변환
```

#### 🎯 해결 효과
- **타입 안정성**: 일관된 데이터 타입 사용
- **데이터베이스 호환성**: Prisma 스키마와 일치
- **오류 방지**: 타입 불일치로 인한 런타임 오류 해결

### 4️⃣ 다중 기기 환경 토큰 충돌 문제

#### 🚨 문제 상황
- **시나리오**: PC방 환경에서 여러 사용자가 같은 기기 사용
- **문제**: 쿠키 기반 토큰으로 인한 사용자 간 충돌
- **위험**: 다른 사용자의 토큰으로 인증 가능

#### 🔍 문제 분석
```javascript
// 현재 구조의 문제점
// 모든 사용자가 같은 쿠키 이름 사용
accessToken: "user1_token"  // 사용자 A
accessToken: "user2_token"  // 사용자 B (덮어쓰기)
```

#### 💡 제안된 해결책 (사용자 거부)

**기기별 쿠키 관리 시스템:**
```javascript
// 1. 기기 ID 생성
const deviceId = generateDeviceId(req);

// 2. 기기별 쿠키 설정
res.cookie(`accessToken_${deviceId}`, accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000
});

// 3. 현재 기기 ID 저장
res.cookie('currentDeviceId', deviceId, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
});
```

**미들웨어 수정:**
```javascript
// src/middleware/auth.middleware.js
const currentDeviceId = req.cookies.currentDeviceId;
const token = req.cookies[`accessToken_${currentDeviceId}`];
```

#### ❌ 사용자 결정
- **거부 이유**: 복잡성 증가, 기존 코드 대폭 수정 필요
- **현재 상태**: 단일 사용자 환경에 최적화된 구조 유지

### 5️⃣ 환경 변수 로딩 문제

#### 🚨 문제 상황
```bash
error: Environment variable not found: DATABASE_URL.
```

#### 🔍 문제 분석
**원인**: `.env` 파일이 디렉토리로 생성됨
```bash
# 잘못된 상태
.env/  # 디렉토리
```

#### ✅ 해결 방법

**1. 잘못된 .env 디렉토리 삭제**
```bash
rmdir .env
```

**2. 올바른 .env 파일 생성**
```bash
# PowerShell에서
New-Item -Path ".env" -ItemType File

# 또는 수동으로 파일 생성
```

**3. 환경 변수 설정**
```env
DATABASE_URL="mysql://username:password@localhost:3306/game_item_simulator"
JWT_SECRET="your-secret-key"
```

#### 🎯 해결 효과
- **설정 로딩**: dotenv가 올바르게 환경 변수 로드
- **데이터베이스 연결**: Prisma가 DATABASE_URL 인식
- **보안**: JWT_SECRET 설정으로 토큰 서명 가능

## 🔧 기타 문제 및 해결

### 1️⃣ PowerShell 명령어 문제

#### 🚨 문제 상황
```bash
mkdir : A positional parameter cannot be found that accepts argument 'src/middleware'.
```

#### ✅ 해결 방법
```bash
# PowerShell에서는 한 번에 하나씩 생성
mkdir src
mkdir src/middleware
mkdir src/controllers
# ... 기타 디렉토리들
```

### 2️⃣ Git 원격 저장소 설정

#### 🚨 문제 상황
```bash
error: remote origin already exists.
```

#### ✅ 해결 방법
```bash
# 기존 원격 확인
git remote -v

# 원격 URL 변경
git remote set-url origin <new_repository_url>
```

### 3️⃣ 의존성 설치 문제

#### 🚨 문제 상황
```bash
Error: Could not resolve @prisma/client in the current project.
```

#### ✅ 해결 방법
```bash
# Prisma 클라이언트 설치
yarn add @prisma/client

# 클라이언트 생성
npx prisma generate
```

## 📊 문제 해결 통계

| 문제 유형 | 발생 횟수 | 해결 상태 | 주요 원인 |
|-----------|-----------|-----------|-----------|
| 인증 시스템 | 3회 | ✅ 해결 | 보안 요구사항 변경 |
| Prisma 설정 | 2회 | ✅ 해결 | 경로 설정 오류 |
| 타입 불일치 | 2회 | ✅ 해결 | 데이터 타입 혼재 |
| 환경 변수 | 1회 | ✅ 해결 | 파일 생성 오류 |
| 명령어 문법 | 2회 | ✅ 해결 | PowerShell 특성 |

## 🎯 주요 교훈

### 1. 보안 우선 설계
- **HttpOnly 쿠키**: XSS 공격 방지의 핵심
- **SameSite 설정**: CSRF 공격 방지
- **토큰 만료**: 자동 만료로 보안 강화

### 2. 타입 안정성
- **일관된 데이터 타입**: 데이터베이스와 애플리케이션 간 일치
- **명시적 타입 변환**: parseInt() 등으로 타입 보장
- **스키마 검증**: Prisma 스키마와 코드 동기화

### 3. 개발 환경 설정
- **환경 변수 관리**: .env 파일 올바른 생성
- **의존성 관리**: yarn/npm 명령어 정확한 사용
- **Git 설정**: 원격 저장소 올바른 설정

### 4. 문제 해결 방법론
- **단계별 접근**: 문제를 작은 단위로 분해
- **로그 분석**: 오류 메시지 정확한 해석
- **근본 원인 분석**: 증상이 아닌 원인 해결

## 🔮 향후 개선 방향

### 1. 보안 강화
- **Rate Limiting**: API 요청 제한
- **Input Validation**: 입력 데이터 검증 강화
- **Audit Logging**: 보안 이벤트 로깅

### 2. 성능 최적화
- **Database Indexing**: 쿼리 성능 향상
- **Caching**: Redis 캐싱 도입
- **Connection Pooling**: 데이터베이스 연결 최적화

### 3. 모니터링
- **Health Checks**: 서비스 상태 모니터링
- **Error Tracking**: 오류 추적 시스템
- **Performance Metrics**: 성능 지표 수집

---

**📝 작성자**: 이재준  
**📅 작성일**: 2024년 12월  
**🔄 최종 업데이트**: 2024년 12월 