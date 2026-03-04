# FlowBalance Backend Setup Guide

This guide explains how to set up and run the FlowBalance backend API.

## Tech Stack

- **Node.js** — Runtime
- **Express** — Web framework
- **MongoDB** — Database
- **Mongoose** — ODM for MongoDB
- **JWT** — Authentication
- **bcryptjs** — Password hashing
- **dotenv** — Environment variables

---

## Project Structure

```
FlowBalance/
├── server.js              # Entry point
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── User.js            # User model
│   ├── Project.js         # Project model
│   ├── Task.js            # Task model
│   └── Expense.js         # Expense model
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── projectRoutes.js   # Project CRUD
│   ├── taskRoutes.js      # Task CRUD
│   └── expenseRoutes.js   # Expense CRUD
├── middleware/
│   └── authMiddleware.js  # JWT protection
├── .env                   # Environment variables (create from .env.example)
└── .env.example           # Template for .env
```

---

## 1. MongoDB Connection

### Option A: Local MongoDB

1. Install MongoDB Community Edition: https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   - **macOS (Homebrew):** `brew services start mongodb-community`
   - **Windows:** Run `mongod` or use MongoDB as a service
   - **Linux:** `sudo systemctl start mongod`
3. Default connection: `mongodb://localhost:27017/flowbalance`

### Option B: MongoDB Atlas (Cloud)

1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get your connection string
3. Replace `<username>`, `<password>`, and `<cluster>` in:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/flowbalance?retryWrites=true&w=majority
   ```

---

## 2. Environment Variables Setup

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set your values:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/flowbalance
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=30d
   ```

3. **Generate a secure JWT secret** for production:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Copy the output into `JWT_SECRET`.

4. **Important:** Add `.env` to `.gitignore` — never commit secrets.

---

## 3. Install Dependencies & Run Server

```bash
# Install dependencies
npm install

# Start server (production)
npm start

# Start server with auto-reload (development)
npm run dev
```

The server will run at `http://localhost:5000`.

---

## 4. API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint       | Access | Description        |
|--------|----------------|--------|--------------------|
| POST   | /register      | Public | Register new user  |
| POST   | /login         | Public | Login user         |
| GET    | /me            | Private| Get current user   |

**Register Request:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login Request:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (includes JWT):**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Protected Routes (require `Authorization: Bearer <token>`)

#### Projects (`/api/projects`)

| Method | Endpoint | Description      |
|--------|----------|------------------|
| GET    | /        | Get all projects |
| GET    | /:id     | Get one project  |
| POST   | /        | Create project   |
| PUT    | /:id     | Update project   |
| DELETE | /:id     | Delete project   |

#### Tasks (`/api/tasks`)

| Method | Endpoint      | Description       |
|--------|---------------|-------------------|
| GET    | /             | Get all tasks     |
| GET    | /:id          | Get one task      |
| POST   | /             | Create task       |
| PUT    | /:id          | Update task       |
| PATCH  | /:id/toggle   | Toggle completed  |
| DELETE | /:id          | Delete task       |

#### Expenses (`/api/expenses`)

| Method | Endpoint | Description        |
|--------|----------|--------------------|
| GET    | /        | Get all expenses   |
| GET    | /summary | Get monthly summary|
| GET    | /:id     | Get one expense    |
| POST   | /        | Create expense     |
| PUT    | /:id     | Update expense     |
| DELETE | /:id     | Delete expense     |

---

## 5. Example: Using the API

### 1. Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'
```

### 2. Login (save the token)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'
```

### 3. Create a project (use token)
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"My Project","description":"A cool project","tags":["JS","React"]}'
```

---

## Troubleshooting

| Issue                  | Solution                                                    |
|------------------------|-------------------------------------------------------------|
| MongoDB connection fail| Ensure MongoDB is running; check `MONGODB_URI` in `.env`   |
| Port already in use    | Change `PORT` in `.env` or stop the process using it       |
| JWT invalid/expired    | Log in again to get a new token                            |
| CORS errors            | Backend uses `cors()` — ensure frontend URL is allowed     |
