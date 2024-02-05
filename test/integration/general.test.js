// general.test.js
'use strict';

// Import supertest for making HTTP requests to the Express app
const request = require('supertest');
// Import the app and its configuration function
const { app, configureApp } = require('../../src/app');

// Configure the application before running any tests to ensure all middleware and routes are properly initialized
beforeAll(async () => {
  // This step is crucial for setting up any global configurations, middleware, or routes your app might need
  await configureApp();
});

// Test suite for the general (root) route of the application
describe('Root Route', () => {
  // Test case for the GET request to the root route
  test('Root route responds with JSON containing a "Server is running!" message', async () => {
    // Make a GET request to the root route of the app
    const response = await request(app).get('/');

    // Check if the response status code is 200 (OK)
    expect(response.statusCode).toBe(200);
    // Verify the response body contains the expected message
    expect(response.body).toEqual({ message: 'Server is running!' });
    // Ensure the response header specifies that the content type is JSON
    expect(response.headers['content-type']).toMatch(/json/);
  });
});
