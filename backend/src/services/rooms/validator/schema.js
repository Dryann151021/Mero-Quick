import Joi from 'joi';

/* eslint-disable camelcase */
export const roomPayloadSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  address: Joi.string().required(),
  capacity: Joi.number().integer().required(),
  price_per_hour: Joi.number().integer().required(),
  description: Joi.string().required(),
  facilities: Joi.array().items(Joi.object()).required(),
  min_hours: Joi.number().integer().required(),
  open_time: Joi.string().required(),
  close_time: Joi.string().required(),
  type: Joi.string().valid('meeting', 'event').required(),
  images: Joi.string().allow('', null).optional(),
});
