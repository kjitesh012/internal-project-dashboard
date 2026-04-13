const API_BASE = 'http://localhost:8080/api';

/**
 * Project API service for communicating with Spring Boot backend
 */
export const projectAPI = {
  /**
   * Get all projects
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
   * Get a single project by ID
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
   * Update project details
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
   * Create a new task for a project
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
   * Update an existing task
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
   * Delete a task from a project
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
