// Custom error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler utility
export const handleError = (error) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    message = `Resource not found with id: ${error.value}`;
    statusCode = 404;
  }

  // Mongoose duplicate key
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    message = `${field} already exists`;
    statusCode = 409;
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    message = Object.values(error.errors)
      .map((err) => err.message)
      .join(', ');
    statusCode = 400;
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  }

  if (error.name === 'TokenExpiredError') {
    message = 'Token has expired';
    statusCode = 401;
  }

  return { statusCode, message };
};