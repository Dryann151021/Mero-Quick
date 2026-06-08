import Joi from 'joi';

/* eslint-disable */
export const bookingPayloadSchema = Joi.object({
  room_id: Joi.string().required(),

  start_date: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'start_date harus dalam format YYYY-MM-DD',
    }),
  end_date: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'end_date harus dalam format YYYY-MM-DD',
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
}).custom((value, helpers) => {
  const startDateTime = new Date(`${value.start_date}T${value.start_time}`);
  const endDateTime = new Date(`${value.end_date}T${value.end_time}`);

  if (
    Number.isNaN(startDateTime.getTime()) ||
    Number.isNaN(endDateTime.getTime())
  ) {
    return helpers.message('Tanggal atau waktu tidak valid');
  }

  if (endDateTime <= startDateTime) {
    return helpers.message('End datetime harus setelah start datetime');
  }

  return value;
});
