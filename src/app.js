'use strict';

// Load environment variables from .env file for portability and security
require('dotenv').config();

// Import necessary modules
const express = require('express');
const morgan = require('morgan'); // Logging middleware
const helmet = require('helmet'); // Security middleware for setting HTTP headers
const { initializeDatabase } = require('./database/db'); // Database initialization
const generalRouter = require('./routes/general'); // Router for general endpoints
const butterfliesRouter = require('./routes/butterflies'); // Router for butterfly-related endpoints
const usersRouter = require('./routes/users'); // Router for user-related endpoints
const ratingsRouter = require('./routes/ratings'); // Router for ratings-related endpoints
const constants = require('./constants'); // Constants, including configuration values

// Create an Express application
const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Log requests for debugging and monitoring
app.use(helmet()); // Apply security-related HTTP headers

/**
 * Configures and initializes the application.
 * This includes database initialization and route setup.
 */
async function configureApp() {
  // Initialize the database with the path specified in constants
  await initializeDatabase(constants.DB_PATH);

  // Setup route handlers for different parts of the API
  app.use('/', generalRouter);
  app.use('/butterflies', butterfliesRouter);
  app.use('/users', usersRouter);
  app.use('/ratings', ratingsRouter);

  // Catch-all route for handling unmatched requests with a 404 status
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });
}

/**
 * Starts the Express server on the configured port.
 * Also sets up graceful shutdown for cleaner exit during server termination.
 */
async function startServer() {
  // Ensure the application is fully configured before starting
  await configureApp();

  const port = constants.PORT; // Retrieve the port from constants
  const server = app.listen(port, () => {
    console.log(`Butterfly API started at http://localhost:${port}`);
  });

  // Graceful shutdown logic for cleaning up resources on termination
  const shutdown = () => {
    server.close(() => {
      console.log('Server shut down gracefully');
      process.exit(0);
    });
  };

  // Attach shutdown handlers for SIGTERM and SIGINT signals
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

// Only start the server if not running in a test environment
if (process.env.NODE_ENV !== 'test') {
  startServer().catch((err) => console.error('Failed to start server:', err));
}

// Export components for testing or further application setup
module.exports = { app, startServer, configureApp };
