import Joi from 'joi';

export const userPayloadSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  address: Joi.string().required(),
  phoneNumber: Joi.string().required(),
});
