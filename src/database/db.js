// db.js
'use strict';

// Importing the lowdb library and the FileAsync adapter for asynchronous file operations
const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

// A variable to hold the database instance once it is initialized
let db;

/**
 * Initializes the lowdb database with the given file path.
 * This function sets up the database connection using the FileAsync adapter
 * to enable asynchronous file operations, ensuring non-blocking I/O operations.
 *
 * @param {string} dbPath - The file path to the database JSON file.
 */
const initializeDatabase = async (dbPath) => {
  // Creating an adapter for the specified database path
  const adapter = new FileAsync(dbPath);
  // Initializing the database with the adapter
  db = await lowdb(adapter);
  // Ensuring the database is loaded before proceeding
  await db.read();
};

/**
 * Retrieves the initialized database instance.
 * This function provides access to the lowdb database instance
 * to perform various database operations throughout the application.
 *
 * @returns The lowdb database instance.
 */
const getDb = () => db;

// Exporting the functions to initialize the database and get the database instance
module.exports = { initializeDatabase, getDb };
