import { HttpError } from 'http-errors';

export const errorHandler = (error, req, res, next) => {
  // http-errors instance
  if (error instanceof HttpError) {
    return res.status(error.status).json({ message: error.message });
  }

  // Mongoose CastError (invalid ObjectId)
  if (error.name === 'CastError') {
    return res
      .status(400)
      .json({ message: `Invalid ${error.path}: ${error.value}` });
  }

  // Mongoose ValidationError
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // Mongoose duplicate key
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  // Unknown errors
  console.error(error);
  res.status(500).json({ message: error.message || 'Internal Server Error' });
};
