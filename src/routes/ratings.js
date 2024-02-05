// ratings.js
'use strict';

// Import necessary modules and middleware
const express = require('express');
const router = express.Router();
const { validateRatingBody, logRequest } = require('../middleware');
const shortid = require('shortid'); // Used for generating unique identifiers for new ratings
const { getDb } = require('../database/db');

/**
 * Custom Error class for handling "Not Found" errors with a specific status code.
 */
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404; // HTTP status code for Not Found
  }
}

/**
 * Checks if a document exists in a specified collection by its ID.
 *
 * @param {string} collection - The collection name in the database.
 * @param {string} id - The unique identifier of the document to find.
 * @returns {Promise<Object|undefined>} The document if found, otherwise undefined.
 */
async function checkExistence(collection, id) {
  return getDb().get(collection).find({ id }).value();
}

/**
 * Route to create a new rating.
 * Validates both the user and the butterfly exist before creating the rating.
 */
router.post('/', logRequest, validateRatingBody, async (req, res) => {
  try {
    const { userId, butterflyId, rating } = req.body;
    const userExists = await checkExistence('users', userId);
    const butterflyExists = await checkExistence('butterflies', butterflyId);

    if (!userExists || !butterflyExists) {
      throw new NotFoundError('User or Butterfly not found');
    }

    const newRating = { id: shortid.generate(), userId, butterflyId, rating };
    await getDb().get('ratings').push(newRating).write();
    res.status(201).json(newRating);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Error creating a new rating:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

/**
 * Route to get all ratings made by a specific user.
 * Returns detailed information about each rated butterfly.
 */
router.get('/users/:id', logRequest, async (req, res) => {
  try {
    const userId = req.params.id;
    const userExists = await checkExistence('users', userId);

    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userRatings = await getDb().get('ratings').filter({ userId }).value();
    if (!userRatings.length) {
      return res.status(404).json({ error: 'No ratings found for this user' });
    }

    // Retrieve detailed information for each rated butterfly
    const butterflyDetails = await Promise.all(userRatings.map(async (rating) => {
      const butterfly = await checkExistence('butterflies', rating.butterflyId);
      return butterfly ? { ...butterfly, rating: rating.rating } : null;
    }));

    const filteredDetails = butterflyDetails.filter( (detail) => detail !== null);
    res.json(filteredDetails);
  } catch (error) {
    console.error('Error retrieving user ratings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the router for use in the main application
module.exports = router;
