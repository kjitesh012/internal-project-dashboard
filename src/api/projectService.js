/**
 * projectService
 * API client functions for fetching and updating project data from the backend.
 */
const API_BASE = 'http://localhost:8080/api';

/**
 * Project API service for communicating with Spring Boot backend
 */
export const projectAPI = {
  /**
   * Performs an HTTP GET request to fetch all active projects.
   * @returns {Promise<Array>} A promise resolving to an array of project objects.
   */
  getAllProjects: async () => {
    try {
      const response = await fetch(`${API_BASE}/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      return await response.json();
    } catch (error) {
      console.error('getAllProjects error:', error);
      throw error;
    }
  },

  /**
   * Performs an HTTP GET request to fetch a specific project by its ID.
   * @param {number|string} id - The unique ID of the target project.
   * @returns {Promise<Object>} A promise resolving to the project data.
   */
  getProject: async (id) => {
    try {
      const response = await fetch(`${API_BASE}/projects/${id}`);
      if (!response.ok) throw new Error(`Failed to fetch project ${id}`);
      return await response.json();
    } catch (error) {
      console.error('getProject error:', error);
      throw error;
    }
  },

  /**
   * Filter projects by status and search term
   * @param {string} status
   * @param {string} search
   */
  filterProjects: async (status = 'All', search = '') => {
    try {
      const params = new URLSearchParams({
        status: status || 'All',
        search: search || ''
      });
      const response = await fetch(`${API_BASE}/projects/filter?${params}`);
      if (!response.ok) throw new Error('Failed to filter projects');
      return await response.json();
    } catch (error) {
      console.error('filterProjects error:', error);
      throw error;
    }
  },

  /**
   * Performs an HTTP PUT request to modify an existing project's structure.
   * @param {number|string} id - The ID of the project to update.
   * @param {Object} updates - A payload containing the updated string/number values.
   * @returns {Promise<Object>} A promise resolving to the newly updated project.
   */
  updateProject: async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error(`Failed to update project ${id}`);
      return await response.json();
    } catch (error) {
      console.error('updateProject error:', error);
      throw error;
    }
  },

  /**
   * Performs an HTTP POST request to inject a new task into a project's hierarchy.
   * @param {number|string} projectId - The ID of the parent project.
   * @param {Object} task - The payload containing the title and optional status.
   * @returns {Promise<Object>} A promise resolving to the created task entity.
   */
  createTask: async (projectId, task) => {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: task.title,
          status: task.status || 'Pending'
        })
      });
      if (!response.ok) throw new Error('Failed to create task');
      return await response.json();
    } catch (error) {
      console.error('createTask error:', error);
      throw error;
    }
  },

  /**
   * Performs an HTTP PUT request to modify a specific nested task.
   * @param {number|string} projectId - The parent project ID.
   * @param {number|string} taskId - The specific task ID.
   * @param {Object} updates - The payload of modified properties (e.g., status).
   * @returns {Promise<Object>} A promise resolving to the updated task.
   */
  updateTask: async (projectId, taskId, updates) => {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error(`Failed to update task ${taskId}`);
      return await response.json();
    } catch (error) {
      console.error('updateTask error:', error);
      throw error;
    }
  },

  /**
   * Performs an HTTP DELETE request to erase a task permanently.
   * @param {number|string} projectId - The parent project ID.
   * @param {number|string} taskId - The ID of the task to destroy.
   * @returns {Promise<boolean>} A promise resolving to true on successful deletion.
   */
  deleteTask: async (projectId, taskId) => {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}/tasks/${taskId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error(`Failed to delete task ${taskId}`);
      return response.ok;
    } catch (error) {
      console.error('deleteTask error:', error);
      throw error;
    }
  },

  /**
   * Get a specific task
   * @param {number|string} projectId
   * @param {number|string} taskId
   */
  getTask: async (projectId, taskId) => {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}/tasks/${taskId}`);
      if (!response.ok) throw new Error(`Failed to fetch task ${taskId}`);
      return await response.json();
    } catch (error) {
      console.error('getTask error:', error);
      throw error;
    }
  }
};

export default projectAPI;
