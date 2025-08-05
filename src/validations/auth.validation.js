import Joi from 'joi';

// 회원가입 유효성 검사 스키마
export const signupSchema = Joi.object({
  id: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'ID는 영어와 숫자만 사용 가능합니다.',
      'string.min': 'ID는 최소 3자 이상이어야 합니다.',
      'string.max': 'ID는 최대 30자까지 가능합니다.',
      'any.required': 'ID는 필수 입력 항목입니다.'
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': '비밀번호는 최소 6자 이상이어야 합니다.',
      'any.required': '비밀번호는 필수 입력 항목입니다.'
    }),
  
  confirm: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': '비밀번호가 일치하지 않습니다.',
      'any.required': '비밀번호 확인은 필수 입력 항목입니다.'
    }),
  
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': '이름은 최소 2자 이상이어야 합니다.',
      'string.max': '이름은 최대 50자까지 가능합니다.',
      'any.required': '이름은 필수 입력 항목입니다.'
    })
});

// 로그인 유효성 검사 스키마
export const loginSchema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'any.required': 'ID는 필수 입력 항목입니다.'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': '비밀번호는 필수 입력 항목입니다.'
    })
});

// 로그아웃 유효성 검사 스키마 (Cookie 기반이므로 body validation 불필요)
export const logoutSchema = Joi.object({
  // Cookie에서 토큰을 가져오므로 body에는 어떤 데이터도 필요 없음
}).unknown(true).allow({});

// 유효성 검사 미들웨어
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // 모든 에러를 한번에 수집
      stripUnknown: true // 스키마에 정의되지 않은 필드 제거
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        error: '유효성 검사 실패',
        messages: errorMessages
      });
    }

    // 검증된 데이터로 req.body 업데이트
    req.body = value;
    next();
  };
}; 