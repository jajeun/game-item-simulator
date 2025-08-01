import Joi from 'joi';

// 아이템 장착 유효성 검사 스키마
export const equipItemSchema = Joi.object({
  itemCode: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': '아이템 코드는 숫자여야 합니다.',
      'number.integer': '아이템 코드는 정수여야 합니다.',
      'number.positive': '아이템 코드는 양수여야 합니다.',
      'any.required': '아이템 코드는 필수 입력 항목입니다.'
    })
});

// 유효성 검사 미들웨어
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