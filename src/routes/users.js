// users.js
'use strict';

// Importing necessary modules
const express = require('express');
const router = express.Router(); // Create a new router to handle user routes
const { validateUserBody, logRequest } = require('../middleware'); // Middleware for logging and validation
const shortid = require('shortid'); // Utility to generate unique IDs
const { getDb } = require('../database/db'); // Database access

/**
 * Retrieves a user by their unique ID.
 * This endpoint is used to get the details of a specific user from the database.
 * If the user is not found, it responds with a 404 status code.
 */
router.get('/:id', logRequest, async (req, res) => {
  // Attempt to find the user in the database
  const user = await getDb().get('users').find({ id: req.params.id }).value();

  // If the user doesn't exist, return a 404 response
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Respond with the found user's details
  res.json(user);
});

/**
 * Creates a new user.
 * This endpoint accepts user details in the request body, validates them,
 * and then creates a new user entry in the database with a unique ID.
 */
router.post('/', logRequest, validateUserBody, async (req, res) => {
  // Construct a new user object with a unique ID and the provided body
  const newUser = { id: shortid.generate(), ...req.body };

  // Save the new user to the database
  await getDb().get('users').push(newUser).write();

  // Respond with the newly created user and a 201 status code indicating successful creation
  res.status(201).json(newUser);
});

// Export the router to be used by the main application
module.exports = router;
