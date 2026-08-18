import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';

const API_BASE_URL = '/api/tasks';

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }
  return response.json();
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create task: ${error}`);
  }
  return response.json();
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update task: ${error}`);
  }
  return response.json();
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete task: ${response.statusText}`);
  }
}

export async function toggleTaskCompletion(id: string, completed: boolean): Promise<Task> {
  return updateTask(id, { completed });
}
