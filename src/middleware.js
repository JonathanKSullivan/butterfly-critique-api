// middleware.js
// middleware.js
'use strict';

const { validateButterfly, validateUser, validateRating } = require('./validators');

// Enhanced error handler function
const sendValidationError = (res, error) => {
  res.status(400).json({ error: error.message || 'Invalid request body' });
};

// Middleware for validating the request body for creating a new butterfly
async function validateButterflyBody(req, res, next) {
  try {
    validateButterfly(req.body);
    next();
  } catch (error) {
    sendValidationError(res, error);
  }
}

// Middleware for validating the request body for creating a new user
async function validateUserBody(req, res, next) {
  try {
    validateUser(req.body);
    next();
  } catch (error) {
    sendValidationError(res, error);
  }
}

// Middleware for validating the request body for creating a new rating
async function validateRatingBody(req, res, next) {
  try {
    validateRating(req.body);
    next();
  } catch (error) {
    sendValidationError(res, error);
  }
}

// Enhanced logging middleware to include method and IP address
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] Received ${req.method} request for ${req.path} from ${req.ip}`);
  next();
};

module.exports = {
  validateButterflyBody,
  validateUserBody,
  validateRatingBody,
  logRequest
};
