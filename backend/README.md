# Hall Management Backend

This is the backend API for the Hall Management system, built with Express.js and MongoDB.

## Features

- User management
- Authentication (to be implemented)
- Hall/room allocation (to be implemented)
- Admin dashboard (to be implemented)

## Project Structure

- `controllers/` - Request handlers
- `services/` - Business logic
- `routers/` - Route definitions
- `models/` - MongoDB schemas
- `config/` - Configuration files
- `middleware/` - Custom middleware
- `utils/` - Utility functions

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hall_management
   ```

3. Start MongoDB (if using local MongoDB)

4. Run the server:
   ```bash
   npm start
   ```

   For development:
   ```bash
   npm run dev
   ```

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user (returns JWT token)
- `GET /api/users` - Get all users (requires auth)
- `GET /api/users/:id` - Get user by ID (requires auth)
- `PUT /api/users/:id` - Update user (requires auth)
- `DELETE /api/users/:id` - Delete user (requires auth)

## Technologies Used

- Express.js
- MongoDB with Mongoose
- CORS
- dotenv