// db.js
'use strict';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const testDbPath = path.join(__dirname, '../integration/test.db.json');
const adapter = new FileSync(testDbPath);
const db = low(adapter);

// Initial database state
const initialState = {
  users: [],
  butterflies: [],
  ratings: []
};

// Define a function to reset the database to its initial state
function resetDatabase() {
  db.setState(initialState).write(); // Assuming this is your intended logic
}

module.exports = { resetDatabase };
