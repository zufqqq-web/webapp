# Task Manager - Full-Stack Web Application

A complete full-stack task management application built with React, TypeScript, Express, and Vite.

## Features

- **Create, Read, Update, Delete (CRUD)** tasks
- **Filter tasks** by status (All, Active, Completed)
- **Mark tasks as complete/incomplete**
- **Responsive design** for mobile and desktop
- **Form validation** on both client and server
- **Error handling** with user-friendly messages
- **RESTful API** backend

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for development and building
- Custom CSS styling

### Backend
- Node.js with Express
- TypeScript
- In-memory storage (easily replaceable with a database)
- CORS enabled

### Testing
- Vitest for unit tests

## Project Structure

```
/workspace
├── src/                    # Frontend source code
│   ├── api/               # API client functions
│   ├── components/        # React components
│   ├── types/             # TypeScript type definitions
│   └── App.tsx            # Main app component
├── server/                 # Backend source code
│   └── index.ts           # Express server
├── __tests__/             # Test files
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
npm install
```

### Running Locally

Start both the frontend and backend servers with a single command:

```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend API on http://localhost:3001

The frontend is configured to proxy API requests to the backend automatically.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run client` | Start only the frontend dev server |
| `npm run server` | Start only the backend server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run lint` | Run linter |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get a specific task |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/health` | Health check endpoint |

### Request/Response Examples

**Create Task:**
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "My Task",
  "description": "Task description"
}
```

**Response:**
```json
{
  "id": "uuid-here",
  "title": "My Task",
  "description": "Task description",
  "completed": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Validation Rules

### Creating a Task
- `title`: Required, 1-100 characters, cannot be empty or whitespace-only
- `description`: Optional, string type

### Updating a Task
- `title`: Optional, same rules as create
- `description`: Optional, must be string if provided
- `completed`: Optional, must be boolean if provided

## Production Deployment

To build for production:

```bash
npm run build
```

Then start the server:

```bash
NODE_ENV=production node dist-server/server/index.js
```

The production server will serve the built static files from the `dist` directory.

## License

MIT
