import React from 'react';
import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id, !task.completed)}
          id={`task-${task.id}`}
        />
      </div>
      <div className="task-content" onClick={() => onEdit(task)}>
        <h3 className="task-title">{task.title}</h3>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        <div className="task-meta">
          <span className="task-date">Created: {formatDate(task.createdAt)}</span>
          {task.updatedAt !== task.createdAt && (
            <span className="task-date">Updated: {formatDate(task.updatedAt)}</span>
          )}
        </div>
      </div>
      <div className="task-actions">
        <button
          className="btn btn-small btn-edit"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
        >
          ✏️
        </button>
        <button
          className="btn btn-small btn-delete"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
