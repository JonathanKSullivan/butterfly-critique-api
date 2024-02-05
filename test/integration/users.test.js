// users.test.js
'use strict';

// Import necessary modules
const path = require('path');
const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const request = require('supertest');
const shortid = require('shortid');
const { app, configureApp } = require('../../src/app');

beforeAll(async () => {
  // Setup for using a test-specific database
  const testDbPath = path.join(__dirname, 'test.db.json');
  process.env.DB_PATH = testDbPath;

  // Initialize the database with test data
  const db = await lowdb(new FileAsync(testDbPath));
  await db.setState({
    butterflies: [{
      id: 'wxyz9876',
      commonName: 'test-butterfly',
      species: 'Testium butterflius',
      article: 'https://example.com/testium_butterflius'
    }],
    users: [{
      id: 'abcd1234',
      username: 'test-user'
    }],
    ratings: [{
      id: 'rating1234',
      butterflyId: 'wxyz9876',
      userId: 'abcd1234',
      rating: 5
    }]
  }).write();

  // Prepare the application for testing
  await configureApp();
});

// Tests for retrieving a user by ID
describe('GET user', () => {
  // Test for successfully retrieving a user
  it('returns a user successfully when the user exists', async () => {
    const response = await request(app).get('/users/abcd1234');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 'abcd1234',
      username: 'test-user'
    });
  });

  // Test for attempting to retrieve a non-existing user
  it('returns an error when the user does not exist', async () => {
    const response = await request(app).get('/users/bad-id');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'User not found' });
  });
});

// Tests for creating a new user
describe('POST user', () => {
  // Test for successfully creating a new user
  it('creates a new user successfully', async () => {
    // Mock shortid.generate to control the ID assigned to the new user
    shortid.generate = jest.fn().mockReturnValue('new-user-id');

    const postResponse = await request(app)
      .post('/users')
      .send({ username: 'Buster' })
      .expect(201);

    expect(postResponse.body).toEqual({
      id: 'new-user-id',
      username: 'Buster'
    });

    // Verify the new user can be retrieved
    const getResponse = await request(app).get('/users/new-user-id');
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual({
      id: 'new-user-id',
      username: 'Buster'
    });
  });

  // Test for creating a user with an empty request body
  it('returns an error when the request body is empty', async () => {
    const response = await request(app).post('/users').send().expect(400);
    expect(response.body).toEqual({ error: 'username is required.' });
  });

  // Test for creating a user with missing required attributes
  it('returns an error when required attributes are missing', async () => {
    const response = await request(app).post('/users').send({}).expect(400);
    expect(response.body).toEqual({ error: 'username is required.' });
  });
});
