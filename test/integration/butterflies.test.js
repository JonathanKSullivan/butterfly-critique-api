// butterflies.test
'use strict';

// Import modules for file path resolution and HTTP request simulation
const path = require('path');
const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const request = require('supertest');
const shortid = require('shortid');
// Import the configured Express app for testing
const { app, configureApp } = require('../../src/app');

beforeAll(async () => {
  // Initialize a separate database for tests to prevent interference with production data
  const testDbPath = path.join(__dirname, 'test.db.json');
  process.env.DB_PATH = testDbPath;

  // Setup and populate the test database with initial data
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

  // Configure the Express app for testing
  await configureApp();
});

// Test suite for retrieving butterfly information
describe('GET /butterflies/:id endpoint', () => {
  it('successfully retrieves butterfly data when the butterfly exists', async () => {
    const response = await request(app).get('/butterflies/wxyz9876');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        id: 'wxyz9876',
        commonName: 'test-butterfly',
        species: 'Testium butterflius',
        article: 'https://example.com/testium_butterflius'
      }
    });
  });

  it('returns an error when the requested butterfly does not exist', async () => {
    const response = await request(app).get('/butterflies/bad-id');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Butterfly not found' });
  });
});

// Test suite for creating new butterfly entries
describe('POST /butterflies endpoint', () => {
  it('successfully creates a new butterfly', async () => {
    // Mock shortid.generate to control the generated ID for the new butterfly
    shortid.generate = jest.fn().mockReturnValue('new-butterfly-id');

    const newButterflyData = {
      commonName: 'Boop',
      species: 'Boopi beepi',
      article: 'https://example.com/boopi_beepi'
    };
    const postResponse = await request(app).post('/butterflies').send(newButterflyData);

    expect(postResponse.status).toBe(201);
    expect(postResponse.body).toEqual({
      data: {
        id: 'new-butterfly-id',
        ...newButterflyData
      }
    });
  });

  it('returns an error when the request body is empty', async () => {
    const response = await request(app).post('/butterflies').send();
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/commonName: commonName is required/);
  });

  it('returns an error when required attributes are missing', async () => {
    const response = await request(app).post('/butterflies').send({ commonName: 'boop' });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/species: species is required/);
  });
});
