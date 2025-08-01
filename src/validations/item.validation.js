import Joi from 'joi';

// 아이템 생성 유효성 검사 스키마
export const createItemSchema = Joi.object({
  item_code: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': '아이템 코드는 숫자여야 합니다.',
      'number.integer': '아이템 코드는 정수여야 합니다.',
      'number.positive': '아이템 코드는 양수여야 합니다.',
      'any.required': '아이템 코드는 필수 입력 항목입니다.'
    }),
  
  item_name: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': '아이템 이름은 최소 1자 이상이어야 합니다.',
      'string.max': '아이템 이름은 최대 100자까지 가능합니다.',
      'any.required': '아이템 이름은 필수 입력 항목입니다.'
    }),
  
  item_stat: Joi.object()
    .required()
    .messages({
      'object.base': '아이템 스탯은 객체 형태여야 합니다.',
      'any.required': '아이템 스탯은 필수 입력 항목입니다.'
    }),
  
  item_price: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': '아이템 가격은 숫자여야 합니다.',
      'number.integer': '아이템 가격은 정수여야 합니다.',
      'number.min': '아이템 가격은 0 이상이어야 합니다.',
      'any.required': '아이템 가격은 필수 입력 항목입니다.'
    })
});

// 아이템 수정 유효성 검사 스키마
export const updateItemSchema = Joi.object({
  item_name: Joi.string()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.min': '아이템 이름은 최소 1자 이상이어야 합니다.',
      'string.max': '아이템 이름은 최대 100자까지 가능합니다.'
    }),
  
  item_stat: Joi.object()
    .optional()
    .messages({
      'object.base': '아이템 스탯은 객체 형태여야 합니다.'
    })
});

// 유효성 검사 미들웨어 (기존 auth.validation.js와 동일)
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        error: '유효성 검사 실패',
        messages: errorMessages
      });
    }

    req.body = value;
    next();
  };
}; 