
# Project Documentation

## Overview
This project is a Node.js-based server designed to handle user authentication, manage reviews, and interact with a PostgreSQL database.

## Features
- Google Authentication
- Review Management
- Secure database connections using environment variables
- Modular structure for routes and controllers

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- PostgreSQL database running

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the server folder:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
1. Create a `.env` file in the `server` directory with the following variables:
   ```env
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=your_database_name
   SESSION_SECRET=your_session_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:7888/auth/google/callback
   ```

### Running the Server
1. Start the server in development mode:
   ```bash
   npm run dev
   ```
2. Access the API at `http://localhost:7888`.

### Testing
Run tests using:
```bash
npm test
```

## Folder Structure
- `auth/`: Authentication logic
- `controllers/`: Business logic for routes
- `db/`: Database connection
- `routes/`: API routes
- `public/`: Static assets

## Contribution
Feel free to contribute to this project by submitting issues or pull requests.

## License
This project is licensed under the MIT License.
