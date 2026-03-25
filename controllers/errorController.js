const AppError = require("../utils/appError");

// Handle invalid MongoDB ObjectId errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Handle duplicate field errors (e.g., unique constraint)
const handleDuplicateFieldsDB = (err) => {
  const value = Object.values(err.keyValue)[0];
  const field = Object.keys(err.keyValue)[0];
  const message = `Duplicate field value: "${value}" for field "${field}". Please use another value!`;
  return new AppError(message, 400);
};

// Handle Mongoose validation errors
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// Send detailed error response in development mode
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Send minimal error response in production mode
// Only operational errors are exposed to the client
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Log programming or unknown errors internally
    console.error("ERROR 💥", err);

    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

// Global error handling middleware
module.exports = (err, req, res, next) => {
  // Set default values for undefined errors
  const env = process.env.NODE_ENV || "production";
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Development: show full error details
  if (env === "development") {
    sendErrorDev(err, res);

    // Production: transform and sanitize errors
  } else {
    let error = err;

    // Convert known MongoDB/Mongoose errors into operational errors
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
