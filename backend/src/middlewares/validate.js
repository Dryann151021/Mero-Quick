const validate = (schema) => async (c, next) => {
  const body = await c.req.json().catch(() => ({}));
  const { error, value } = schema.validate(body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  if (error) throw error;
  c.set('validated', value);
  await next();
};

const validateQuery = (schema) => async (c, next) => {
  const query = c.req.query();
  const { error, value } = schema.validate(query, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  if (error) throw error;
  c.set('validatedQuery', value);
  await next();
};

export { validate, validateQuery };
