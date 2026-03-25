const AppError = require("../utils/appError");

// Middleware to prevent empty request bodies
// Ensures that POST/PATCH requests contain valid data
exports.checkEmptyBody = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(new AppError("Request body cannot be empty.", 400));
  }

  next();
};
