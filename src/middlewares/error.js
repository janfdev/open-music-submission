import response from "../utils/response.js";
import ClientError from "../exceptions/client-error.js";

const ErrorHandler = (err, req, res) => {
  // Handle Client Error and it subsclasses (InvariantError, NotFoundError)
  if (err instanceof ClientError) {
    return response(res, err.statusCode, err.message, null);
  }

  // Handle errir joi validation
  if (err.isJoi) {
    return response(res, 400, err.details[0].message, null);
  }

  const status = err.statusCode || err.status || 500;

  const message = err.message || "Internal Server Error";

  console.error("Unhanled error: ", err);
  return response(res, status, message, null);
};

export default ErrorHandler;
