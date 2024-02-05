// app.e2e.test.js
'use strict';

// Import necessary modules for the test
const path = require('path');
const request = require('supertest');
// Import the application to be tested
const { app } = require('../../src/app');
// Import utility to reset the database to a known state before tests
const { resetDatabase } = require('../fixtures/db');
// Import the configuration function of the application
const { configureApp } = require('../../src/app');

beforeAll(async () => {
  // Setup environment for tests by pointing to a test-specific database
  process.env.DB_PATH = path.join(__dirname, '../fixtures/test.db.json');

  // Initialize the application with test configuration and reset the database
  await configureApp();
  await resetDatabase();
});

describe('Butterfly Critique API E2E Tests', () => {
  let userId, butterflyId;

  test('Create a new user', async () => {
    // Prepare and send a request to create a new user
    const response = await request(app)
      .post('/users')
      .send({ username: 'e2eTester' })
      .expect(201); // Expect a 201 Created response

    // Extract the user ID for use in subsequent tests
    userId = response.body.id;
    // Verify the response contains the expected username
    expect(response.body).toHaveProperty('username', 'e2eTester');
  });

  test('Create a new butterfly', async () => {
    // Define a new butterfly and send a request to create it
    const butterflyData = {
      commonName: 'E2E Butterfly',
      species: 'Testicus apis',
      article: 'https://example.com/e2e_butterfly'
    };

    const response = await request(app)
      .post('/butterflies')
      .send(butterflyData)
      .expect(201); // Expect a 201 Created response

    // Extract the butterfly ID for use in subsequent tests
    butterflyId = response.body.data.id;

    // Verify the response matches the expected butterfly data structure
    const expectedButterflyData = {
      data: {
        commonName: 'E2E Butterfly',
        species: 'Testicus apis',
        id: expect.any(String),
        article: 'https://example.com/e2e_butterfly'
      }
    };

    expect(response.body).toMatchObject(expectedButterflyData);
  });

  test('Post a rating for the butterfly by the new user', async () => {
    // Prepare and send a request to rate the previously created butterfly
    const ratingData = {
      userId,
      butterflyId,
      rating: 5
    };

    const response = await request(app)
      .post('/ratings')
      .send(ratingData)
      .expect(201); // Expect a 201 Created response

    // Verify the response contains the expected rating data
    expect(response.body).toMatchObject({
      userId,
      butterflyId,
      rating: 5
    });
  });

  test('Retrieve all ratings for the new user', async () => {
    // Send a request to retrieve all ratings made by the new user
    const response = await request(app)
      .get(`/ratings/users/${userId}`)
      .expect(200); // Expect a 200 OK response

    // Verify the response contains an array of ratings for the created butterfly
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rating: 5,
          article: 'https://example.com/e2e_butterfly',
          commonName: 'E2E Butterfly',
          id: butterflyId,
          species: 'Testicus apis'
        })
      ])
    );
  });

  // More E2E tests can be added here as needed...
});
