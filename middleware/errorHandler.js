export const errorHandler = (err, req, res, next) => {
  // If a route handler already set a non-200 status, keep it.
  // Otherwise, derive a sensible status code from the error.
  let statusCode = res.statusCode;

  if (!statusCode || statusCode === 200) {
    // Mongoose validation errors (e.g. minlength, required)
    if (err?.name === 'ValidationError') statusCode = 400;
    // Invalid ObjectId casts, etc.
    else if (err?.name === 'CastError') statusCode = 400;
    // Mongo duplicate key error
    else if (err?.code === 11000) statusCode = 409;
    // Auth / permission style errors
    else if (err?.name === 'UnauthorizedError') statusCode = 401;
    else if (err?.name === 'ForbiddenError') statusCode = 403;
    // Fallback
    else statusCode = 500;
  }

  res.status(statusCode);

  res.json({
    message: err?.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? null : err?.stack,
  });
};
