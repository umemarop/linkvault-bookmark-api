// Custom error class for handling operational errors
// Extends the built-in Error class and standardizes error structure
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;

    // Set error type based on status code (4xx = fail, 5xx = error)
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // Mark error as operational (trusted, expected error)
    this.isOperational = true;

    // Capture stack trace excluding constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
