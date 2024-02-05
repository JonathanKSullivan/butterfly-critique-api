// general.js
'use strict';

// Import the necessary modules
const express = require('express');
const router = express.Router();
const { logRequest } = require('../middleware'); // Middleware for logging request details

/**
 * Route to check the API's health status.
 * This endpoint is useful for quickly verifying that the API service is operational.
 * It employs the logRequest middleware to log the incoming request for monitoring purposes.
 */
router.get('/', logRequest, (req, res) => {
  // Responds with a simple JSON message indicating the server is running
  res.json({ message: 'Server is running!' });
});

// Export the router to make it available for inclusion in the main app
module.exports = router;
