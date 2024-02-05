# Butterfly Critique API Documentation

## Introduction
The Butterfly Critique API is a simulated RESTful API designed for managing butterfly sightings and user interactions through ratings. Built with Node.js and Express and leveraging a lowdb database for persistence, this API facilitates the addition, rating, and querying of butterfly sightings, as well as user management.

## Getting Started
### Setup (Example Only)
To mimic setting up this project:
- Clone the example repository (not a real URL):
  ```
  git clone https://example.com/fake-repo/butterfly-api-homework.git
  ```
- Install dependencies:
  ```
  cd butterfly-api-homework && npm install
  ```
- Initialize the database with default data:
  ```
  npm run init-db
  ```
- Start the server:
  ```
  npm start
  ```
  The API will then be accessible at `http://localhost:8080/`.

## Features and API Reference

### General
- **GET /**: Checks the API's health and returns a message indicating the server is running.

### Users
- **GET /users/:id**: Retrieves details of a specific user by ID.
- **POST /users**: Registers a new user with a username.

### Butterflies
- **GET /butterflies/:id**: Fetches details about a specific butterfly by ID.
- **POST /butterflies**: Adds a new butterfly sighting to the database.

### Ratings
- **POST /ratings**: Allows users to submit a rating for a butterfly sighting.
- **GET /ratings/users/:userId**: Retrieves all ratings made by a specific user, including detailed information on each rated butterfly.

## Detailed Endpoint Information

### Register a New User
- **Endpoint:** POST /users
- **Payload Example:**
  ```json
  {
    "username": "butterfly_enthusiast"
  }
  ```
- **Success Response:**
  ```json
  {
    "id": "generatedUserId",
    "username": "butterfly_enthusiast"
  }
  ```

### Add a New Butterfly Sighting
- **Endpoint:** POST /butterflies
- **Payload Example:**
  ```json
  {
    "commonName": "Monarch",
    "species": "Danaus plexippus",
    "article": "https://en.wikipedia.org/wiki/Monarch_butterfly"
  }
  ```
- **Success Response:**
  ```json
  {
    "id": "generatedButterflyId",
    "commonName": "Monarch",
    "species": "Danaus plexippus",
    "article": "https://en.wikipedia.org/wiki/Monarch_butterfly"
  }
  ```

### Submit a Rating for a Butterfly
- **Endpoint:** POST /ratings
- **Payload Example:**
  ```json
  {
    "userId": "userId",
    "butterflyId": "butterflyId",
    "rating": 4
  }
  ```
- **Success Response:**
  ```json
  {
    "id": "generatedRatingId",
    "userId": "userId",
    "butterflyId": "butterflyId",
    "rating": 4
  }
  ```

## Development and Testing
To run the suite of automated tests:
```
npm test
```
For continuous testing mode:
```
npm run test-watch
```

## Contributing
This project is a hypothetical example and does not accept contributions. However, the usual workflow involves forking the repository, creating a feature branch, making changes, and submitting a pull request.

## License
This example project is not licensed for use and is intended for demonstration purposes only.
