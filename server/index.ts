import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateTaskInput {
  title: string;
  description?: string;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  completed?: boolean;
}

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory storage (in production, use a database)
let tasks: Task[] = [];

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Validation helpers
function validateCreateTask(input: unknown): input is CreateTaskInput {
  if (!input || typeof input !== 'object') return false;
  const obj = input as Record<string, unknown>;
  if (!obj.title || typeof obj.title !== 'string') return false;
  if (obj.title.trim().length === 0) return false;
  if (obj.title.length > 100) return false;
  if (obj.description !== undefined && typeof obj.description !== 'string') return false;
  return true;
}

function validateUpdateTask(input: unknown): input is UpdateTaskInput {
  if (!input || typeof input !== 'object') return false;
  const obj = input as Record<string, unknown>;
  if (obj.title !== undefined) {
    if (typeof obj.title !== 'string' || obj.title.trim().length === 0 || obj.title.length > 100) {
      return false;
    }
  }
  if (obj.description !== undefined && typeof obj.description !== 'string') {
    return false;
  }
  if (obj.completed !== undefined && typeof obj.completed !== 'boolean') {
    return false;
  }
  return true;
}

// Routes

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Get single task
app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// Create task
app.post('/api/tasks', (req, res) => {
  if (!validateCreateTask(req.body)) {
    return res.status(400).json({ error: 'Invalid input. Title is required and must be 1-100 characters.' });
  }

  const now = new Date().toISOString();
  const newTask: Task = {
    id: uuidv4(),
    title: req.body.title.trim(),
    description: req.body.description?.trim() || '',
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (!validateUpdateTask(req.body)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const task = tasks[taskIndex];
  const updates: UpdateTaskInput = req.body;

  if (updates.title !== undefined) {
    task.title = updates.title.trim();
  }
  if (updates.description !== undefined) {
    task.description = updates.description.trim();
  }
  if (updates.completed !== undefined) {
    task.completed = updates.completed;
  }
  task.updatedAt = new Date().toISOString();

  tasks[taskIndex] = task;
  res.json(task);
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all for SPA routing in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/tasks`);
});
