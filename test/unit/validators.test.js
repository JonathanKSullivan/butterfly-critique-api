// validators.test.js
'use strict';

// Import the validator functions to be tested
const { validateButterfly, validateUser, validateRating } = require('../../src/validators');

// Group tests for the validateButterfly function
describe('validateButterfly', () => {
  // Define a valid butterfly object for testing
  const validButterfly = {
    commonName: 'Butterfly Name',
    species: 'Species name',
    article: 'http://example.com/article'
  };

  // Test case for valid butterfly data
  it('passes validation for a well-formed butterfly object', () => {
    expect(() => validateButterfly(validButterfly)).not.toThrow();
  });

  // Test cases for various invalid butterfly data scenarios
  it('throws an error for an empty object', () => {
    expect(() => validateButterfly({})).toThrow('The following properties have invalid values:');
  });

  it('throws an error for invalid commonName type', () => {
    expect(() => validateButterfly({ ...validButterfly, commonName: 123 })).toThrow('commonName must be a string.');
  });

  it('throws an error for unexpected additional fields', () => {
    expect(() => validateButterfly({ extra: 'field', ...validButterfly })).toThrow('The following keys are invalid: extra');
  });
});

// Group tests for the validateUser function
describe('validateUser', () => {
  // Define a valid user object for testing
  const validUser = { username: 'test-user' };

  // Test case for valid user data
  it('passes validation for a well-formed user object', () => {
    expect(() => validateUser(validUser)).not.toThrow();
  });

  // Test cases for various invalid user data scenarios
  it('throws an error for an empty object', () => {
    expect(() => validateUser({})).toThrow('username is required');
  });

  it('throws an error for unexpected additional fields', () => {
    expect(() => validateUser({ extra: 'field', ...validUser })).toThrow('The following keys are invalid: extra');
  });

  it('throws an error for invalid username type', () => {
    expect(() => validateUser({ username: [555] })).toThrow('username must be a string');
  });
});

// Group tests for the validateRating function
describe('validateRating', () => {
  // Define a valid rating object for testing
  const validRating = {
    userId: 'user123',
    butterflyId: 'butterfly456',
    rating: 4 // Assuming the rating scale is 0-5
  };

  // Test case for valid rating data
  it('passes validation for a well-formed rating object', () => {
    expect(() => validateRating(validRating)).not.toThrow();
  });

  // Test cases for various invalid rating data scenarios
  it('throws an error for missing fields', () => {
    expect(() => validateRating({})).toThrow('The string userId is required');
  });

  it('throws an error for out-of-range rating', () => {
    expect(() => validateRating({ ...validRating, rating: 6 })).toThrow('rating must be within 0 and 5');
  });

  it('throws an error for non-numeric rating value', () => {
    expect(() => validateRating({ ...validRating, rating: 'excellent' })).toThrow('rating must be within 0 and 5');
  });

  it('throws an error for empty userId', () => {
    expect(() => validateRating({ ...validRating, userId: '' })).toThrow('The string userId is required');
  });

  it('throws an error for invalid butterflyId type', () => {
    expect(() => validateRating({ ...validRating, butterflyId: 123 })).toThrow('The string butterflyId is required');
  });
});
