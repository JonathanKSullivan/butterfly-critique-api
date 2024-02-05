// butterflies.js
'use strict';

const express = require('express');
const router = express.Router();
const { logRequest, validateButterflyBody } = require('../middleware');
const shortid = require('shortid');
const { getDb } = require('../database/db');

// Helper function to find a butterfly
async function findButterfly(id) {
  return getDb().get('butterflies').find({ id }).value();
}

/**
 * Get an existing butterfly
 * GET
 */
router.get('/:id', logRequest, async (req, res) => {
  try {
    const butterfly = await findButterfly(req.params.id);
    if (!butterfly) {
      return res.status(404).json({ error: 'Butterfly not found' });
    }
    res.json({ data: butterfly });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Create a new butterfly
 * POST
 */
router.post('/', logRequest, validateButterflyBody, async (req, res) => {
  try {
    const newButterfly = {
      id: shortid.generate(),
      ...req.body
    };

    await getDb().get('butterflies').push(newButterfly).write();
    res.status(201).json({ data: newButterfly });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the router
module.exports = router;
