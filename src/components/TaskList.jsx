import React, { useState } from 'react';

const API_URL = 'http://localhost:8080/api';

function TaskList({ tasks, projectId, onTaskDeleted, onTaskUpdated }) {
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [newStatus, setNewStatus] = useState({});

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    setDeletingId(taskId);
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete task');
      
      onTaskDeleted(taskId);
    } catch (err) {
      alert('Failed to delete task. Make sure backend is running.');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (taskId, currentStatus, overrideStatus) => {
    const status = overrideStatus || newStatus[taskId];
    if (!status || status === currentStatus) return;

    setUpdatingId(taskId);
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) throw new Error('Failed to update task');
      
      const updated = await response.json();
      onTaskUpdated(updated);
      setNewStatus(prev => ({ ...prev, [taskId]: undefined }));
    } catch (err) {
      alert('Failed to update task. Make sure backend is running.');
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className="task-item">
          <div className="task-content">
            <span className="task-title">{task.title}</span>
          </div>

          <div className="task-controls">
            <select
              value={newStatus[task.id] !== undefined ? newStatus[task.id] : task.status}
              onChange={(e) => {
                const val = e.target.value;
                setNewStatus(prev => ({ ...prev, [task.id]: val }));
                setTimeout(() => handleStatusChange(task.id, task.status, val), 0);
              }}
              disabled={updatingId === task.id}
              className="task-status-select"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <button
              className="btn-delete-task"
              onClick={() => handleDeleteTask(task.id)}
              disabled={deletingId === task.id}
              title="Delete task"
            >
              {deletingId === task.id ? '...' : '✕'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
