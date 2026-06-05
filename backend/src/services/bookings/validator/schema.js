import Joi from 'joi';

/* eslint-disable */
export const bookingPayloadSchema = Joi.object({
  room_id: Joi.string().required(),
  booking_date: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'booking_date harus dalam format YYYY-MM-DD',
    }),
  start_time: Joi.string()
    .regex(/^\d{2}:\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'start_time harus dalam format HH:MM',
    }),
  end_time: Joi.string()
    .regex(/^\d{2}:\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'end_time harus dalam format HH:MM',
    }),
  activity: Joi.string().required(),
  organization: Joi.string().required(),
});
