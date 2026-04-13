/**
 * TaskList Component
 * Renders the list of tasks inside a project and provides status update capabilities.
 */
import React, { useState } from 'react';

const API_URL = 'http://localhost:8080/api';

function TaskList({ tasks, projectId, onTaskDeleted, onTaskUpdated }) {
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [newStatus, setNewStatus] = useState({});

  /**
   * Dispatches the delete command to the API and fires the parent UI update.
   * @param {number} taskId - ID of the target task.
   */
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

  /**
   * Sends the isolated task status change to the backend service.
   * Leverages a closure timeout locally to bypass strict state delays on the component loop.
   * @param {number} taskId - Target task ID.
   * @param {string} currentStatus - Existing status text.
   * @param {string} [overrideStatus] - An immediate string intercept replacement.
   */
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
