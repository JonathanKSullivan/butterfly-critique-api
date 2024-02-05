// constants.js
'use strict';

// Load environment variables from the .env file. This is crucial for ensuring
// that sensitive information and configuration settings are not hard-coded into the application,
// but rather dynamically loaded based on the environment the application is running in.
require('dotenv').config();

module.exports = {
  // Database Path (DB_PATH): Specifies the file path for the lowdb database file.
  // If not specified in the environment variables, defaults to 'butterflies.db.json'.
  // This allows for flexibility in database location and makes it easier to switch
  // databases in different environments (e.g., development, testing, production).
  DB_PATH: process.env.DB_PATH || './butterflies.db.json',

  // Port (PORT): Determines the port on which the Express server will listen.
  // It is read from the environment variables to allow for easy configuration
  // across different environments. If not specified, it defaults to 8080.
  // Reading the port from environment variables is a best practice for deploying
  // applications, as it allows for the port to be set by the hosting environment.
  PORT: parseInt(process.env.PORT, 10) || 8080
};
