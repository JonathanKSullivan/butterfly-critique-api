// init-db.js
'use strict';

const fs = require('fs').promises; // Use promise-based fs module
const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const constants = require('../src/constants');

async function init() {
  try {
    const fileExists = await fs.access(constants.DB_PATH)
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      console.log('Database already exists. Initialization skipped.');
      return;
    }

    const db = await lowdb(new FileAsync(constants.DB_PATH));
    console.log('Initializing new database...');

    await db.defaults({
      butterflies: [
        // Pre-defined butterflies
      ],
      users: [
        // Pre-defined users
      ],
      ratings: []
    }).write();

    console.log('Database initialized with default data.');
  } catch (error) {
    console.error('Failed to initialize the database:', error);
  }
}

if (require.main === module) {
  init().catch(console.error);
}
