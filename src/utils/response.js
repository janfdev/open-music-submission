const response = (res, statusCode, message, data) => {
  const status =
    statusCode < 400 ? "success" : statusCode < 500 ? "fail" : "error";

  const responseBody = {
    status,
  };

  if (data !== null && data !== undefined) {
    responseBody.data = data;
  }

  if (message) {
    responseBody.message = message;
  }

  return res.status(statusCode).json(responseBody);
};

export default response;
