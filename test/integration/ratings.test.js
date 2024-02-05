// ratings.test.js
'use strict';

// Import necessary modules and utilities
const path = require('path');
const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const request = require('supertest');
const shortid = require('shortid');
const { app, configureApp } = require('../../src/app');

beforeAll(async () => {
  // Initialize a test-specific database
  const testDbPath = path.join(__dirname, 'test.db.json');
  process.env.DB_PATH = testDbPath; // Ensure tests use a separate database

  const db = await lowdb(new FileAsync(testDbPath));

  // Pre-populate the test database with necessary data
  await db.setState({
    butterflies: [{
      id: 'butterfly1234',
      commonName: 'Monarch',
      species: 'Danaus plexippus',
      article: 'https://example.com/monarch'
    }],
    users: [{
      id: 'user1234',
      username: 'nature_lover'
    }],
    ratings: [{
      id: 'rating1234',
      userId: 'user1234',
      butterflyId: 'butterfly1234',
      rating: 5
    }]
  }).write();

  // Configure the application for testing
  await configureApp();
});

// Tests for creating ratings
describe('POST rating', () => {
  // Test for successfully creating a rating
  it('creates a rating successfully', async () => {
    // Mock shortid to control the generated ID for the new rating
    shortid.generate = jest.fn().mockReturnValue('rating5678');

    const postResponse = await request(app)
      .post('/ratings')
      .send({
        userId: 'user1234',
        butterflyId: 'butterfly1234',
        rating: 5
      }).expect(201); // Verify the request succeeds with a 201 status

    // Check the response to ensure it contains the expected rating information
    expect(postResponse.body).toEqual({
      id: 'rating5678',
      userId: 'user1234',
      butterflyId: 'butterfly1234',
      rating: 5
    });
  });

  // Test for attempting to create a rating for non-existent user or butterfly
  it('returns an error when user or butterfly does not exist', async () => {
    const response = await request(app)
      .post('/ratings')
      .send({
        userId: 'nonexistent-user',
        butterflyId: 'nonexistent-butterfly',
        rating: 3
      }).expect(404); // Verify the request fails with a 404 status

    // Confirm the response includes the expected error message
    expect(response.body.error).toEqual('User or Butterfly not found');
  });
});

// Tests for retrieving user-specific ratings
describe('GET user ratings', () => {
  // Test for successfully retrieving ratings for a specific user
  it('retrieves ratings for a user successfully', async () => {
    const response = await request(app)
      .get('/ratings/users/user1234').expect(200); // Verify the request succeeds with a 200 status

    // Check the response to ensure it contains the ratings data
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'butterfly1234',
        commonName: 'Monarch',
        species: 'Danaus plexippus',
        article: 'https://example.com/monarch',
        rating: 5
      })
    ]));
  });

  // Test for attempting to retrieve ratings for a non-existent user
  it('returns an error when no ratings found for the user', async () => {
    const response = await request(app)
      .get('/ratings/users/nonexistent-user').expect(404); // Verify the request fails with a 404 status

    // Confirm the response includes the expected error message
    expect(response.body.error).toEqual('User not found');
  });
});
