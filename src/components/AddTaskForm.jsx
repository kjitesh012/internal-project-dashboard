/**
 * AddTaskForm Component
 * Provides a UI form to add a new task to a specific project.
 */
import React, { useState } from 'react';

const API_URL = 'http://localhost:8080/api';

function AddTaskForm({ projectId, onTaskAdded, onCancel, existingTasks = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    status: 'Pending'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Synchronizes the controlled input states with component state.
   * @param {React.ChangeEvent} e - The triggered change event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Triggers the backend API to save the new task and updates the parent state.
   * @param {React.FormEvent} e - Form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to add task');
      
      const newTask = await response.json();
      onTaskAdded(newTask);
      setFormData({ title: '', status: 'Pending' });
    } catch (err) {
      setError('Failed to add task. Make sure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      {error && <div className="error-message">{error}</div>}

      <div className="form-row">
        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={handleChange}
          required
          className="task-input"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="task-status-select"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <button type="submit" className="btn-add-task" disabled={loading}>
          {loading ? 'Adding...' : 'Add'}
        </button>

        <button type="button" className="btn-cancel-task" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddTaskForm;
