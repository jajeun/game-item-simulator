// 전역 에러 핸들링 미들웨어
export const errorHandler = (err, req, res, next) => {
  console.error('🚨 에러 발생:', err);

  // Prisma 에러 처리
  if (err.code === 'P2002') {
    return res.status(400).json({
      error: '중복된 데이터입니다.',
      message: '이미 존재하는 데이터입니다.'
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: '데이터를 찾을 수 없습니다.',
      message: '요청한 데이터가 존재하지 않습니다.'
    });
  }

  // JWT 에러 처리
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: '유효하지 않은 토큰입니다.',
      message: '토큰 형식이 올바르지 않습니다.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: '토큰이 만료되었습니다.',
      message: '다시 로그인해주세요.'
    });
  }

  // 기본 서버 에러
  res.status(500).json({
    error: '서버 내부 오류가 발생했습니다.',
    message: process.env.NODE_ENV === 'development' ? err.message : '잠시 후 다시 시도해주세요.'
  });
};

// 404 에러 핸들링
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: '요청한 엔드포인트를 찾을 수 없습니다.',
    path: req.originalUrl,
    method: req.method
  });
}; 