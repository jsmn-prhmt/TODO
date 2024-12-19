# TODO Application with JWT Auth, Caching, Pagination, and MySQL

This project is a demonstration of a TODO application with:

- **Backend (Node.js, TypeScript, Express, TypeORM, MySQL):**
  - **JWT-based authentication**: Secure endpoints with JSON Web Tokens.
  - **Pagination**: `/tasks` endpoint supports `?page` and `?limit` to fetch tasks in pages.
  - **Caching**: In-memory caching of task lists by user and pagination parameters for better performance.
  - **Input Validation**: Using `class-validator` and DTOs to validate incoming requests.
  - **Error Handling**: A global error handler with a `HttpError` class for consistent JSON error responses.

- **Frontend (React, TypeScript)**:
  - Simple interface to login, retrieve tasks, and manage them.
  - Stores and sends JWT token for authentication.
  - No offline support or PWA.

## Features

1. **Authentication**:
   - `/auth/register` to register a new user.
   - `/auth/login` to get a JWT token.
   - Protected routes (`/tasks`, `/groups`) require `Authorization: Bearer <token>` header.

2. **Task Management**:
   - Create, update, delete tasks.
   - Associate tasks with optional groups.
   - Fetch tasks in a paginated manner: `/tasks?page=1&limit=10`.

3. **Caching**:
   - GET `/tasks` results are cached per `(userId, page, limit)`.
   - When tasks are modified (create/update/delete), related cache entries are invalidated.

4. **Pagination**:
   - Query parameters `page` (default=1) and `limit` (default=10).

5. **MySQL Database**:
   - Configurable via `.env`.
   - Uses TypeORM migrations.

## Getting Started

### Prerequisites
- Node.js
- MySQL server running locally

### Backend Setup
1. Navigate to `backend/`.
2. Create a `.env` file with values:

    JWT_SECRET=your_jwt_secret DB_HOST=localhost DB_PORT=3306 DB_USERNAME=root DB_PASSWORD=your_password DB_DATABASE=todo_db

3. Install dependencies: `npm install`
4. Run migrations: `npm run build npm run migration:run`
5. Start the backend: `npm run dev`

The backend runs on `http://localhost:3001`.

### Frontend Setup

1. Navigate to `frontend/`.
2. Install dependencies: `npm install`
3. Start the frontend: `npm start`

The frontend runs on `http://localhost:3000`.

### Usage

1. **Register:**

```bash
curl -X POST -H "Content-Type: application/json" \
- d '{"username":"testuser","password":"testpass"}' \
http://localhost:3001/auth/register
```

2. **Login:**

```bash
curl -X POST -H "Content-Type: application/json" \
- d '{"username":"testuser","password":"testpass"}' \
http://localhost:3001/auth/login
```

3. **Authorized Requests:**

```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:3001/tasks
```

### Caching Details

- In-memory cache is used for /tasks GET queries.
- Keyed by userId, page, limit.
- On create/update/delete tasks, the cache for that user is invalidated to ensure fresh data on subsequent fetches.

###  Pagination Details

- Default `page=1` and `limit=10`.
- You can customize by sending `?page=<number>&limit=<number>`.

### Testing

- Backend tests:

```bash
cd backend
npm run test
```

### Further Improvements

- Use Redis or another external store for caching in production.
- Enhance validation and error messages.
- Add rate-limiting and production-ready logging.