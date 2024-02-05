// validators.js
'use strict';

const v = require('@mapbox/fusspot');

// Example of a reusable validator for common patterns
const stringValidator = v.string;

const validateButterfly = v.assert(
  v.strictShape({
    commonName: v.required(stringValidator),
    species: v.required(stringValidator),
    article: v.required(stringValidator)
  })
);

const validateUser = v.assert(
  v.strictShape({
    username: v.required(stringValidator)
  })
);

const validateRatingInternal = v.assert(
  v.strictShape({
    userId: v.required(stringValidator),
    butterflyId: v.required(stringValidator),
    rating: v.required(v.range(0, 5))
  })
);

const validateRating = (ratingData) => {
  // Check for non-empty userId
  if (!ratingData.userId || typeof ratingData.userId !== 'string' || ratingData.userId.trim() === '') {
    throw new Error('The string userId is required');
  }

  // Check for non-empty butterflyId
  if (!ratingData.butterflyId || typeof ratingData.butterflyId !== 'string' || ratingData.butterflyId.trim() === '') {
    throw new Error('The string butterflyId is required');
  }

  // Check for rating within the range
  if (typeof ratingData.rating !== 'number' || ratingData.rating < 0 || ratingData.rating > 5) {
    throw new Error('rating must be within 0 and 5');
  }

  // Assuming validateRating exists and is correct, but you could integrate this logic directly if needed
  return validateRatingInternal(ratingData); // Only if additional validation logic is present in validateRating
};


module.exports = {
  validateButterfly,
  validateUser,
  validateRating
};
