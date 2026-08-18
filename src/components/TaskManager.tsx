import React, { useState, useEffect, useCallback } from 'react';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';
import * as taskApi from '../api/taskApi';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';

type FilterType = 'all' | 'active' | 'completed';

export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskApi.fetchTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreateTask = async (title: string, description: string) => {
    try {
      const input: CreateTaskInput = { title, description };
      const newTask = await taskApi.createTask(input);
      setTasks((prev) => [...prev, newTask]);
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const handleUpdateTask = async (id: string, input: UpdateTaskInput) => {
    try {
      const updatedTask = await taskApi.updateTask(id, input);
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      setEditingTask(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      await taskApi.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      const updatedTask = await taskApi.toggleTaskCompletion(id, completed);
      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleEditSubmit = (title: string, description: string) => {
    if (editingTask) {
      handleUpdateTask(editingTask.id, { title, description });
    }
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="task-manager">
      <header className="header">
        <h1>Task Manager</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add Task'}
        </button>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Task</h2>
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {editingTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Task</h2>
            <TaskForm
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingTask(null)}
              initialTitle={editingTask.title}
              initialDescription={editingTask.description}
              submitLabel="Save Changes"
            />
          </div>
        </div>
      )}

      <div className="filter-buttons">
        <button
          className={`btn ${filter === 'all' ? 'btn-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`btn ${filter === 'active' ? 'btn-active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`btn ${filter === 'completed' ? 'btn-active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <TaskList
        tasks={tasks}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
        onEdit={setEditingTask}
        filter={filter}
      />
    </div>
  );
};
