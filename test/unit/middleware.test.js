// middleware.test.js
'use strict';

// Import dependencies for mocking HTTP requests and responses
const httpMocks = require('node-mocks-http');
// Import middleware functions to be tested
const {
  logRequest,
  validateButterflyBody,
  validateUserBody,
  validateRatingBody
} = require('../../src/middleware');
// Import validators to be mocked
const { validateButterfly, validateUser, validateRating } = require('../../src/validators');

// Setup for mocking validator functions to control their behavior during tests
jest.mock('../../src/validators', () => ({
  validateButterfly: jest.fn(),
  validateUser: jest.fn(),
  validateRating: jest.fn()
}));

describe('Middleware Tests', () => {
  // Initialize request, response, and next function mocks
  let req, res, next;

  beforeEach(() => {
    // Create mock request and response objects before each test
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    // Mock next function to track its calls
    next = jest.fn();
    // Ensure mocks are reset to their initial state before each test
    jest.clearAllMocks();
  });

  describe('logRequest Middleware', () => {
    test('logs the request details', () => {
      // Mock console.log to intercept log messages
      console.log = jest.fn();

      // Setup mock request attributes
      req.method = 'GET';
      req.path = '/';
      req.ip = '127.0.0.1';

      // Execute the middleware with the mock request, response, and next function
      logRequest(req, res, next);

      // Verify that console.log was called with the expected message
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Received GET request for / from 127.0.0.1'));
      // Ensure the next middleware in the stack would be called
      expect(next).toHaveBeenCalled();
    });
  });

  // Dynamic tests for each validation middleware using describe.each
  describe.each([
    ['validateButterflyBody', validateButterflyBody, validateButterfly],
    ['validateUserBody', validateUserBody, validateUser],
    ['validateRatingBody', validateRatingBody, validateRating]
  ])('%s Middleware', (name, middlewareFunction, validatorMock) => {
    test('calls next() if validation passes', () => {
      // Example body data for the request, adjust based on the validator being tested
      const bodyData = { username: 'testuser' };
      req.body = bodyData;

      // Mock the validator to simulate a successful validation
      validatorMock.mockImplementation(() => true);

      // Execute the middleware function
      middlewareFunction(req, res, next);

      // Check that the validator was called with the correct data and next() was called
      expect(validatorMock).toHaveBeenCalledWith(bodyData);
      expect(next).toHaveBeenCalled();
    });

    test('returns 400 if validation fails', () => {
      // Setup mock request body to simulate an invalid request
      req.body = { invalid: 'data' };

      // Mock the validator to throw an error, simulating a validation failure
      validatorMock.mockImplementation(() => {
        throw new Error('Invalid request body');
      });

      // Execute the middleware function
      middlewareFunction(req, res, next);

      // Verify that a 400 status code response is sent and next() is not called
      expect(res.statusCode).toBe(400);
      const responseData = JSON.parse(res._getData());
      expect(responseData).toEqual(expect.objectContaining({ error: 'Invalid request body' }));
      expect(next).not.toHaveBeenCalled();
    });
  });
});
