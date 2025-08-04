import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client 인스턴스 생성 및 설정
 * - 로깅 설정: query, info, warn, error 모든 로그 출력
 * - 에러 포맷: pretty 형식으로 보기 좋게 출력
 */
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty"
});

export default prisma;