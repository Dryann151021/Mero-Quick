const response = (c, statusCode = 200, message = 'Success', data = null) => {
  const payload = {
    status: statusCode >= 400 ? 'fail' : 'success',
    message,
  };

  if (data !== null) {
    payload.data = data;
  }

  return c.json(payload, statusCode);
};

export default response;