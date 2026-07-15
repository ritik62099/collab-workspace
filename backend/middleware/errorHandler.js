import { handleError } from '../utils/errorHandler.js';
import { logger } from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  const { statusCode, message } = handleError(err);

  // Log error
  logger.error(`${req.method} ${req.url}`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Handle 404 - Not Found
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export default errorHandler;